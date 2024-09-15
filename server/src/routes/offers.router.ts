import { offersContract } from "../contracts/offers.contract";
import OfferModel, { OfferType } from "../models/Offer.model";
import { User } from "../models/User.model";
import { tsServer } from "../utils/utils";
import { createTransport } from "nodemailer";
import multer from "multer";
import { UTApi } from "uploadthing/server";
import mongoose from "mongoose";
import TechnologyModel from "../models/Technology.model";
import EmploymentTypeModel from "../models/EmploymentType.model";
import LocalizationModel from "../models/Localization.model";
import ExperienceModel from "../models/Experience.model";
import ContractTypeModel from "../models/ContractType.model";
import Stripe from "stripe";
import bodyParser from "body-parser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const offersRouter = tsServer.router(offersContract, {
  createOffer: {
    middleware: [upload.array("logo")],
    handler: async ({ body, req }) => {
      const data = body;
      data.technologies = JSON.parse(data.technologies);
      const {
        title,
        content,
        experience,
        localization,
        employmentType,
        contractType,
        minSalary,
        maxSalary,
        technologies,
        currency,
        userId,
        companyName,
      } = data;
      const offerPrice = 1000;
      try {
        const utapi = new UTApi();
        let uploadedImg;
        console.log("first  log");
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
          const logo = req.files[0];
          const metadata = {};
          const uploadResponse = await utapi.uploadFiles(
            new File([logo.buffer], logo.originalname),
            { metadata }
          );
          if (uploadResponse.error) {
            console.error("error", uploadResponse.error);
            return {
              status: 500,
              body: {
                msg: "We failed to add your new offer.",
              },
            };
          }
          uploadedImg = uploadResponse.data;
        }

        const offerId = new mongoose.Types.ObjectId();
        const offer = await OfferModel.create({
          _id: offerId,
          title,
          content,
          experience,
          localization,
          contractType,
          employmentType,
          maxSalary,
          minSalary,
          technologies,
          currency,
          logo: uploadedImg?.url,
          companyName,
          isPaid: false,
        });

        await User.findByIdAndUpdate(
          { _id: userId },
          { $push: { createdOffers: offer._id } }
        );

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency,
                product_data: {
                  name: title,
                },
                unit_amount: offerPrice,
              },
              quantity: 1,
            },
          ],
          metadata: {
            offerId: offerId.toString(),
          },
          mode: "payment",
          success_url: `${process.env.CLIENT_URL}/hire-remotely/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.CLIENT_URL}/hire-remotely/cancel`,
        });

        return {
          status: 201,
          body: {
            msg: "Your new offer is successfuly posted.",
            sessionId: session.id,
          },
        };
      } catch (err) {
        return {
          status: 500,
          body: {
            msg: "We failed to add your new offer.",
          },
        };
      }
    },
  },
  getOffers: async ({ query }) => {
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 10;
    const skip = (page - 1) * limit;
    try {
      const filters: any = {};
      if (
        query.filters?.employmentType &&
        query.filters.employmentType.length > 0
      ) {
        filters.employmentType = { $in: query.filters.employmentType };
      }
      if (
        query.filters?.localization &&
        query.filters.localization.length > 0
      ) {
        filters.localization = { $in: query.filters.localization };
      }
      if (query.filters?.experience && query.filters.experience.length > 0) {
        filters.experience = { $in: query.filters.experience };
      }
      if (
        query.filters?.technologies &&
        query.filters.technologies.length > 0
      ) {
        filters.technologies = { $in: query.filters.technologies };
      }
      if (query.filters?.keyword) {
        filters.$or = [
          { title: { $regex: query.filters.keyword, $options: "i" } },
          { content: { $regex: query.filters.keyword, $options: "i" } },
        ];
      }
      if (query.filters?.minSalary) {
        filters.minSalary = { $gte: query.filters.minSalary };
      }
      filters.isDeleted = false;
      filters.isPaid = true;
      let sortValue = {};
      switch (query.sortOption) {
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
          OfferModel.find(filters)
            .sort(sortValue)
            .skip(skip)
            .limit(limit)
            .lean(),
          OfferModel.countDocuments(filters),
        ]);
      if (!fetchedOffers.length) {
        return {
          status: 200,
          body: {
            offers: [],
            msg: "No offers found",
            pagination: {
              total,
              page,
              pages: Math.ceil(total / limit),
            },
          },
        };
      }
      const preparedOffers = fetchedOffers.map((offer) => ({
        ...offer,
        _id: offer._id.toString(),
      }));
      return {
        status: 200,
        body: {
          offers: preparedOffers,
          msg: "Offers fetched successfully",
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
          },
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to get you available offers.",
        },
      };
    }
  },
  getUserOffers: async ({ query }) => {
    const { ids } = query;
    const offers = await OfferModel.find({ _id: { $in: ids } }).lean();
    if (!offers.length) {
      return {
        status: 200,
        body: {
          offers: [],
          msg: "No offers found",
        },
      };
    }
    const preparedOffers = offers.map((offer) => ({
      ...offer,
      _id: offer._id.toString(),
    }));
    return {
      status: 200,
      body: {
        offers: preparedOffers,
        msg: "Offers fetched successfully",
      },
    };
  },
  getOffer: async ({ query }) => {
    try {
      const offer = await OfferModel.findById(query.id).lean();
      if (!offer) {
        return {
          status: 404,
          body: {
            msg: "Offer not found",
          },
        };
      }
      const preparedOffer = { ...offer, _id: offer._id.toString() };
      return {
        status: 200,
        body: {
          offer: preparedOffer,
          msg: "Offer fetched successfully",
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to get you the selected offer.",
        },
      };
    }
  },
  updateOffer: async ({ body }) => {
    const { offerId } = body;
    const offer = await OfferModel.findByIdAndUpdate({ _id: offerId }, body);
    if (!offer) {
      return {
        status: 404,
        body: {
          msg: "Offer not found",
        },
      };
    }
    return {
      status: 200,
      body: {
        msg: "Offer updated successfully",
      },
    };
  },
  deleteOffer: async ({ body }) => {
    const { offerId } = body;
    const offer = await OfferModel.findByIdAndUpdate(
      { _id: offerId },
      { isDeleted: true, deletedAt: new Date() }
    );
    if (!offer) {
      return {
        status: 404,
        body: {
          msg: "Offer not found",
        },
      };
    }
    await User.updateMany(
      { createdOffers: offerId },
      { $pull: { createdOffers: offerId } }
    );
    return {
      status: 200,
      body: {
        msg: "Offer deleted successfully",
      },
    };
  },
  offerApply: {
    middleware: [upload.array("cv")],
    handler: async ({ body, req }) => {
      const { description, email, name, offerId } = body;
      const objectOfferId = new mongoose.Types.ObjectId(`${offerId}`);
      const offerData = await OfferModel.findById(objectOfferId, { title: 1 });
      if (!offerData) {
        return {
          status: 404,
          body: {
            msg: "Offer not found",
          },
        };
      }
      const offerCreator = await User.findOne(
        {
          createdOffers: {
            $in: [objectOfferId],
          },
        },
        { email: 1 }
      );
      if (!offerCreator) {
        return {
          status: 404,
          body: {
            msg: "Offer creator not found",
          },
        };
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
        return {
          status: 404,
          body: {
            msg: "No file uploaded",
          },
        };
      }

      const mailOptions = {
        from: email,
        to: offerCreator.email,
        subject: `New offer application ${offerData.title}`,
        text: `${name} just applied for the position you posted!
        Few words about them: ${description}`,
        attachments: [
          {
            filename:
              (Array.isArray(req.files) && req.files[0].originalname) ||
              "empty field",
            path:
              (Array.isArray(req.files) && req.files[0].path) || "empty path",
            contentType: "application/pdf",
          },
        ],
      };
      await transporter.sendMail(mailOptions);
      return {
        status: 200,
        body: {
          msg: "Offer applied successfully",
        },
      };
    },
  },
  getTechnologies: async () => {
    try {
      const technologies = await TechnologyModel.find().select({
        code: 0,
        createdAt: 0,
      });
      if (!technologies.length) {
        return {
          status: 200,
          body: {
            technologies: [],
            msg: "No technologies found",
          },
        };
      }
      return {
        status: 200,
        body: {
          technologies,
          msg: "Technologies fetched successfully",
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to get you available technologies.",
        },
      };
    }
  },
  getEmploymentTypes: async () => {
    try {
      const employmentTypes = await EmploymentTypeModel.find().select({
        code: 0,
        createdAt: 0,
      });
      if (!employmentTypes.length) {
        return {
          status: 200,
          body: {
            employmentTypes: [],
            msg: "No employment types found",
          },
        };
      }
      return {
        status: 200,
        body: {
          employmentTypes,
          msg: "Employment types fetched successfully",
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to get you available employment types.",
        },
      };
    }
  },
  getLocalizations: async () => {
    try {
      const localizations = await LocalizationModel.find().select({
        code: 0,
        createdAt: 0,
      });
      if (!localizations.length) {
        return {
          status: 200,
          body: {
            localizations: [],
            msg: "No localizations found",
          },
        };
      }
      return {
        status: 200,
        body: {
          localizations,
          msg: "Localizations fetched successfully",
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to get you available localizations.",
        },
      };
    }
  },
  getExperiences: async () => {
    try {
      const experiences = await ExperienceModel.find().select({
        code: 0,
        createdAt: 0,
      });
      if (!experiences.length) {
        return {
          status: 200,
          body: {
            experiences: [],
            msg: "No experiences found",
          },
        };
      }
      return {
        status: 200,
        body: {
          experiences,
          msg: "Experiences fetched successfully",
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to get you available experiences.",
        },
      };
    }
  },
  getContractTypes: async () => {
    try {
      const contractTypes = await ContractTypeModel.find().select({
        code: 0,
        createdAt: 0,
      });
      if (!contractTypes.length) {
        return {
          status: 200,
          body: {
            contractTypes: [],
            msg: "No contract types found",
          },
        };
      }
      return {
        status: 200,
        body: {
          contractTypes,
          msg: "Contract types fetched successfully",
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to get you available contract types.",
        },
      };
    }
  },
  payForOffer: async ({ body }) => {
    const { offerId, title, currency } = body;
    const offerPrice = 1000;
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: title,
              },
              unit_amount: offerPrice,
            },
            quantity: 1,
          },
        ],
        metadata: {
          offerId: offerId.toString(),
        },
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/hire-remotely/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/hire-remotely/cancel`,
      });
      return {
        status: 200,
        body: {
          msg: "Payment session created",
          sessionId: session.id,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        body: {
          msg: "We failed to create payment session.",
        },
      };
    }
  },
  webhook: {
    middleware: [bodyParser.raw({ type: "application/json" })],
    handler: async ({ req, res, body }) => {
      const sig = req.headers["stripe-signature"];

      if (!sig || typeof sig !== "string") {
        console.error("Stripe signature is missing or invalid.");
        return {
          status: 400,
          body: {
            msg: "Invalid or missing Stripe signature.",
          },
        };
      }

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET || ""
        );
      } catch (err) {
        console.error(
          `Webhook signature verification failed.`,
          (err as Error).message
        );
        return {
          status: 400,
          body: {
            msg: "Webhook signature verification failed.",
          },
        };
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        console.log("Session:", session);
        if (session.metadata) {
          console.log(session.metadata.offerId);
          await OfferModel.findByIdAndUpdate(session.metadata.offerId, {
            isPaid: true,
          });
        }
      }

      return {
        status: 200,
        body: {
          msg: "Webhook received",
        },
      };
    },
  },
});
