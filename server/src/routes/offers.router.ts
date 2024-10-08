import { offersContract } from "jobremotecontracts";
import OfferModel, { OfferType } from "../models/Offer.model";
import { User } from "../models/User.model";
import { tsServer } from "../utils/utils";
import { createTransport } from "nodemailer";
import multer from "multer";
import mongoose from "mongoose";
import TechnologyModel from "../models/Technology.model";
import EmploymentTypeModel from "../models/EmploymentType.model";
import LocalizationModel from "../models/Localization.model";
import ExperienceModel from "../models/Experience.model";
import ContractTypeModel from "../models/ContractType.model";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { priceLogic } from "../middleware/priceLogic";
import { updateFiles, uploadFile } from "../utils/uploadthing";
import { sanitizeOfferContent } from "../middleware/sanitizer";
import { PaymentModel } from "../models/PaymentType.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "TESTING", {
  apiVersion: "2024-06-20",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const offersRouter = tsServer.router(offersContract, {
  createOffer: {
    middleware: [
      upload.array("logo"),
      (req, res, next) => priceLogic(req, res, next),
      (req, res, next) => sanitizeOfferContent(req, res, next),
    ],
    handler: async ({ body, req, res }) => {
      const data = body;
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

        return {
          status: 201,
          body: {
            msg: "Your new offer is successfuly posted.",
            sessionId: session.id,
          },
        };
      } catch (err) {
        console.error("Error creating offer", err);

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
      if (query.filters?.technology && query.filters.technology.length > 0) {
        filters.technologies = { $in: query.filters.technology };
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
      switch (query.sort) {
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
        userId: offer.userId.toString(),
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
      console.error("Error fetching offers", err);
      return {
        status: 500,
        body: {
          msg: "We failed to get you available offers.",
        },
      };
    }
  },

  updateOffer: {
    middleware: [upload.array("logo")],
    handler: async ({ body, files }) => {
      const { _id, ...updatedData } = body;
      const offerData = await OfferModel.findById(_id).lean();

      if (!offerData) {
        return {
          status: 404,
          body: {
            msg: "Offer not found",
          },
        };
      }

      if (files && Array.isArray(files) && files.length > 0) {
        const uploadedImg = await updateFiles(
          offerData.logo ? offerData.logo.key : "",
          files
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

      return {
        status: 200,
        body: {
          msg: "Offer updated successfully",
        },
      };
    },
  },
  getPaymentTypes: async () => {
    try {
      const paymentTypes = await PaymentModel.find({});

      if (!paymentTypes.length) {
        return {
          status: 200,
          body: {
            paymentTypes: [],
            msg: "No payment types found",
          },
        };
      }
      return {
        status: 200,
        body: {
          paymentTypes,
          msg: "Payment types fetched successfully",
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to get you available payment types. Try again later.",
        },
      };
    }
  },
  deleteOffer: async ({ body }) => {
    const { _id } = body;
    const deletedOffer = await OfferModel.findByIdAndUpdate(
      { _id },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    if (!deletedOffer) {
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
        msg: "Offer deleted successfully",
      },
    };
  },
  offerApply: {
    middleware: [upload.array("cv")],
    handler: async ({ body, req }) => {
      const { description, email, name, offerId, userId } = body;
      const objectOfferId = new mongoose.Types.ObjectId(`${offerId}`);
      try {
        const offerData = await OfferModel.findById(objectOfferId, {
          title: 1,
        }).lean();

        if (!offerData) {
          return {
            status: 404,
            body: {
              msg: "Offer not found",
            },
          };
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
        return {
          status: 200,
          body: {
            msg: "Offer applied successfully",
          },
        };
      } catch (err) {
        console.error(err);
        return {
          status: 500,
          body: {
            msg: "We failed to apply for the offer.",
          },
        };
      }
    },
  },
  getTechnologies: async () => {
    try {
      const technologies = await TechnologyModel.find()
        .select({
          code: 0,
          createdAt: 0,
        })
        .sort({ name: 1 });
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
      const employmentTypes = await EmploymentTypeModel.find()
        .select({
          code: 0,
          createdAt: 0,
        })
        .sort({ name: 1 });
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
      const localizations = await LocalizationModel.find()
        .select({
          code: 0,
          createdAt: 0,
        })
        .sort({ name: 1 });
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
      const experiences = await ExperienceModel.find()
        .select({
          code: 0,
          createdAt: 0,
        })
        .sort({ name: 1 });
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
      const contractTypes = await ContractTypeModel.find()
        .select({
          code: 0,
          createdAt: 0,
        })
        .sort({ name: 1 });
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
  payForOffer: {
    middleware: [(req, res, next) => priceLogic(req, res, next)],
    handler: async ({ body, res }) => {
      const { offerId, title, currency } = body;

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
  },
  extendActiveOffer: {
    middleware: [(req, res, next) => priceLogic(req, res, next)],
    handler: async ({ body, res }) => {
      try {
        const { offerId, title, currency } = body;
        const price = res.locals.price;
        const activeMonths = res.locals.activeMonths;

        const offer = await OfferModel.findById(offerId)
          .select({ activeUntil: 1 })
          .lean();
        if (!offer) {
          return {
            status: 404,
            body: {
              msg: "Offer not found",
            },
          };
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
            activeUntil: offer.activeUntil,
            activeMonths,
            type: "extend",
          },
          mode: "payment",
          success_url: `${process.env.CORS_URI}/account`,
          cancel_url: `${process.env.CORS_URI}/account`,
        });
        return {
          status: 200,
          body: {
            msg: "Payment session created",
            sessionId: session.id,
          },
        };
      } catch (err) {
        return {
          status: 500,
          body: {
            msg: "We failed to extend your offer.",
          },
        };
      }
    },
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

      try {
        const event = stripe.webhooks.constructEvent(
          body,
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
            }
            if (session.metadata.type === "extend") {
              const extendedUntil = new Date(
                new Date(session.metadata.activeUntil).setMonth(
                  new Date(session.metadata.activeUntil).getMonth() +
                    Number(session.metadata.activeMonths)
                )
              );
              await OfferModel.findByIdAndUpdate(session.metadata.offerId, {
                $set: {
                  activeUntil: extendedUntil,
                },
              });
            }
          }
        }

        return {
          status: 200,
          body: {
            msg: `Webhook received ${event.id}`,
          },
        };
      } catch (err) {
        console.error(
          `Webhook signature verification failed.`,
          (err as Error).message
        );
        return {
          status: 500,
          body: {
            msg: `Webhook signature verification failed: ${
              (err as Error).message
            }`,
          },
        };
      }
    },
  },
});
