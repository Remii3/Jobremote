import OfferModel, { OfferType } from "../models/Offer.model";
import { User } from "../models/User.model";
import { createTransport } from "nodemailer";
import mongoose from "mongoose";
import TechnologyModel from "../models/Technology.model";
import { updateFiles, uploadFile } from "../utils/uploadthing";
import { PaymentModel } from "../models/PaymentType.model";
import Stripe from "stripe";
import { Response, Request } from "express";
import {
  DeleteOffer,
  ExtendActiveOffer,
  GetOffers,
  OfferApply,
  PayForOffer,
} from "../types/controllers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "TESTING", {
  apiVersion: "2024-06-20",
});

export const createOffer = async (req: Request, res: Response) => {
  const data = req.body;
  const price = res.locals.price;
  const activeMonths = res.locals.activeMonths;

  try {
    data.technologies = JSON.parse(data.technologies);

    const offerId = new mongoose.Types.ObjectId();
    const uploadedImg =
      req.files && Array.isArray(req.files) && req.files.length > 0
        ? await uploadFile(req.files, offerId.toString())
        : null;

    await OfferModel.create({
      ...data,
      _id: offerId,
      logo: uploadedImg || null,
      isPaid: false,
      expireAt: null,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: data.currency,
            product_data: {
              name: data.title,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        offerId: offerId.toString(),
        activeMonths,
        type: "activation",
      },
      mode: "payment",
      success_url: `${process.env.CORS_URI}/hire-remotely/success/${offerId}`,
      cancel_url: `${process.env.CORS_URI}/hire-remotely/cancel/${offerId}`,
    });

    return res.status(201).json({
      msg: "Your new offer is successfuly posted.",
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Error creating offer", err);

    return res.status(500).json({
      msg: "We failed to add your new offer.",
    });
  }
};

export const getOffers = async (
  req: Request<{}, {}, {}, GetOffers>,
  res: Response
) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const skip = (page - 1) * limit;
  try {
    const filters: any = {};
    if (
      req.query.filters?.employmentType &&
      req.query.filters.employmentType.length > 0
    ) {
      filters.employmentType = { $in: req.query.filters.employmentType };
    }
    if (
      req.query.filters?.localization &&
      req.query.filters.localization.length > 0
    ) {
      filters.localization = { $in: req.query.filters.localization };
    }
    if (
      req.query.filters?.experience &&
      req.query.filters.experience.length > 0
    ) {
      filters.experience = { $in: req.query.filters.experience };
    }

    if (
      req.query.filters?.technologies &&
      req.query.filters.technologies.length > 0
    ) {
      filters.technologies = { $in: req.query.filters.technologies };
    }
    if (req.query.filters?.keyword) {
      filters.$or = [
        { title: { $regex: req.query.filters.keyword, $options: "i" } },
        { content: { $regex: req.query.filters.keyword, $options: "i" } },
      ];
    }
    if (req.query.filters?.minSalary) {
      filters.minSalary = { $gte: req.query.filters.minSalary };
    }

    if (
      req.query.filters?.contractType &&
      req.query.filters.contractType.length > 0
    ) {
      filters.contractType = { $in: req.query.filters.contractType };
    }

    filters.isDeleted = false;
    filters.isPaid = true;
    let sortValue = {};
    switch (req.query.sort) {
      case "salary_highest":
        sortValue = { minSalary: -1 };
        break;
      case "salary_lowest":
        sortValue = { minSalary: 1 };
        break;
      case "latest":
        sortValue = { createdAt: -1 };
        break;
      default:
        sortValue = { createdAt: -1 };
        break;
    }

    const [fetchedOffers, total]: [fetchedOffers: OfferType[], number] =
      await Promise.all([
        OfferModel.find(filters).sort(sortValue).skip(skip).limit(limit).lean(),
        OfferModel.countDocuments(filters),
      ]);
    if (!fetchedOffers.length) {
      return res.status(200).json({
        offers: [],
        msg: "No offers found",
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    }
    const preparedOffers = fetchedOffers.map((offer) => ({
      ...offer,
      _id: offer._id.toString(),
      userId: offer.userId.toString(),
    }));

    return res.status(200).json({
      offers: preparedOffers,
      msg: "Offers fetched successfully",
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching offers", err);
    return res.status(500).json({
      msg: "We failed to get you available offers.",
    });
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const { ...updatedData } = req.body;
  const offerData = await OfferModel.findById(_id).lean();

  if (!offerData) {
    return res.status(404).json({
      msg: "Offer not found",
    });
  }

  if (updatedData.technologies) {
    updatedData.technologies = JSON.parse(updatedData.technologies);
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const uploadedImg = await updateFiles(
      offerData.logo ? offerData.logo.key : "",
      req.files
    );

    await OfferModel.findByIdAndUpdate(
      { _id },
      {
        ...updatedData,
        logo: uploadedImg,
      }
    );
  } else {
    await OfferModel.findByIdAndUpdate(
      { _id },
      {
        ...updatedData,
      }
    );
  }

  return res.status(200).json({
    msg: "Offer updated successfully",
  });
};

export const getPaymentTypes = async (req: Request, res: Response) => {
  try {
    const paymentTypes = await PaymentModel.find({});

    if (!paymentTypes.length) {
      return res.status(200).json({
        paymentTypes: [],
        msg: "No payment types found",
      });
    }
    return res.status(200).json({
      paymentTypes,
      msg: "Payment types fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "We failed to get you available payment types. Try again later.",
    });
  }
};

export const deleteOffer = async (
  req: Request<{}, {}, DeleteOffer>,
  res: Response
) => {
  const { _id } = req.body;
  const deletedOffer = await OfferModel.findByIdAndUpdate(
    { _id },
    { $set: { isDeleted: true, deletedAt: new Date() } },
    { new: true }
  );
  if (!deletedOffer) {
    return res.status(404).json({
      msg: "Offer not found",
    });
  }

  return res.status(200).json({
    msg: "Offer deleted successfully",
  });
};

export const offerApply = async (
  req: Request<{}, {}, OfferApply>,
  res: Response
) => {
  const { description, email, name, offerId, userId } = req.body;
  const objectOfferId = new mongoose.Types.ObjectId(`${offerId}`);
  try {
    const offerData = await OfferModel.findById(objectOfferId, {
      title: 1,
    }).lean();

    if (!offerData) {
      return res.status(404).json({
        msg: "Offer not found",
      });
    }
    const offerCreator = await User.findById(
      { _id: userId },
      {
        email: 1,
        _id: 1,
        name: 1,
      }
    ).lean();
    if (!offerCreator) {
      return res.status(404).json({
        msg: "Offer creator not found",
      });
    }

    const transporter = createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(404).json({
        msg: "No file uploaded",
      });
    }

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER, // TODO change to offerCreator.email when ready for prod
      subject: `New Application for Your Job Posting: ${offerData.title}`,
      html: `<p>Hello <strong>${
        offerCreator.name || offerCreator.email
      }</strong>,</p>
  <p>You have received a new application for the <strong>${
    offerData.title
  }</strong> position you posted on our website!</p>
  
  <p><strong>Applicant Name:</strong> ${name}</p>
  <p><strong>Message from the Applicant:</strong><br>
  "${description}"</p>
  
  <p><strong>What’s next?</strong><br>
  We recommend reviewing the applicant’s details and getting in touch with them for next steps.</p>
  
  <p>Thank you for using <strong>JobRemote</strong> to post your job offer, and we wish you success in finding the perfect candidate!</p>
  
  <p>Best regards,<br>
  <strong>Jobremote Team</strong></p>`,
      attachments: [
        {
          filename: `${name}_CV` || "empty field",
          content: req.files[0].buffer || "empty buffer",
          contentType: req.files[0].mimetype || "application/pdf",
        },
      ],
    });
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: { appliedToOffers: objectOfferId },
      });
    }
    return res.status(200).json({
      msg: "Application sent successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "We failed to apply for the offer.",
    });
  }
};

export const getTechnologies = async (req: Request, res: Response) => {
  try {
    const technologies = await TechnologyModel.find()
      .select({
        code: 0,
        createdAt: 0,
      })
      .sort({ name: 1 });

    if (!technologies.length) {
      return res.status(200).json({
        technologies: [],
        msg: "No technologies found",
      });
    }
    return res.status(200).json({
      technologies,
      msg: "Technologies fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "We failed to get you available technologies.",
    });
  }
};

export const payForOffer = async (
  req: Request<{}, {}, PayForOffer>,
  res: Response
) => {
  const { offerId, title, currency } = req.body;

  try {
    const price = res.locals.price;
    const activeMonths = res.locals.activeMonths;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: title,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        offerId: offerId.toString(),
        activeMonths,
        type: "activation",
      },
      mode: "payment",
      success_url: `${process.env.CORS_URI}/account`,
      cancel_url: `${process.env.CORS_URI}/account`,
    });
    return res.status(200).json({
      msg: "Payment session created",
      sessionId: session.id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "We failed to create payment session.",
    });
  }
};

export const extendActiveOffer = async (
  req: Request<{}, {}, ExtendActiveOffer>,
  res: Response
) => {
  try {
    const { offerId, title, currency } = req.body;
    const price = res.locals.price;
    const activeMonths = res.locals.activeMonths;

    const offer = await OfferModel.findById(offerId)
      .select({ activeUntil: 1 })
      .lean();
    if (!offer) {
      return res.status(404).json({
        msg: "Offer not found",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: title,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        offerId: offerId.toString(),
        activeUntil: new Date(offer.activeUntil!).toISOString(),
        activeMonths,
        type: "extend",
      },

      mode: "payment",
      success_url: `${process.env.CORS_URI}/account`,
      cancel_url: `${process.env.CORS_URI}/account`,
    });

    return res.status(200).json({
      msg: "Payment session created",
      sessionId: session.id,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "We failed to extend your offer.",
    });
  }
};

export const webhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig || typeof sig !== "string") {
    console.error("Stripe signature is missing or invalid.");
    return res.status(400).json({
      msg: "Invalid or missing Stripe signature.",
    });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.metadata) {
        if (session.metadata.type === "activation") {
          const activeUntil = new Date(
            new Date().setMonth(
              new Date().getMonth() + Number(session.metadata.activeMonths)
            )
          );

          await OfferModel.findByIdAndUpdate(session.metadata.offerId, {
            $set: {
              isPaid: true,
              activeUntil,
            },
          });
          return res.status(200).json({
            msg: `Webhook received ${event.id}`,
            type: `${session.metadata.type} `,
          });
        }
        if (session.metadata.type === "extend") {
          const activeUntilDate = new Date(session.metadata.activeUntil);
          const activeMonths = Number(session.metadata.activeMonths);

          const activeUntil = new Date(
            activeUntilDate.setMonth(activeUntilDate.getMonth() + activeMonths)
          );

          await OfferModel.findByIdAndUpdate(session.metadata.offerId, {
            $set: {
              activeUntil,
            },
          });
          return res.status(200).json({
            msg: `Webhook received ${event.id}`,
            type: `${session.metadata.type} `,
          });
        }
      }
    }
    return res.status(200).json({
      msg: `Webhook received ${event.id}`,
    });
  } catch (err) {
    console.error(
      `Webhook signature verification failed.`,
      (err as Error).message
    );
    return res.status(500).json({
      msg: `Webhook signature verification failed: ${(err as Error).message}`,
    });
  }
};
