import { offersContract } from "../contracts/offers.contract";
import OfferModel, { OfferType } from "../models/Offer.model";
import { User } from "../models/User.model";
import { c, tsServer } from "../utils/utils";

export const offersRouter = tsServer.router(offersContract, {
  createOffer: async ({ body }) => {
    const {
      title,
      content,
      experience,
      localization,
      employmentType,
      typeOfWork,
      minSalary,
      maxSalary,
      technologies,
      currency,
      userId,
    } = body;
    try {
      const offer = await OfferModel.create({
        title,
        content,
        experience,
        localization,
        typeOfWork,
        maxSalary,
        employmentType,
        minSalary,
        technologies,
        currency,
      });

      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { createdOffers: offer._id } }
      );

      return {
        status: 201,
        body: {
          msg: "Your new offer is successfuly posted.",
          offer: { ...offer, userId },
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
  getOffers: async ({ query }) => {
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 10;
    const skip = (page - 1) * limit;
    try {
      const filters: any = {};

      if (query.filters?.typeOfWork && query.filters.typeOfWork.length > 0) {
        filters.typeOfWork = { $in: query.filters.typeOfWork };
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
          OfferModel.find(filters).sort(sortValue).skip(skip).limit(limit),
          OfferModel.countDocuments(filters),
        ]);

      if (!fetchedOffers.length) {
        return {
          status: 200,
          body: {
            offers: fetchedOffers,
            msg: "No offers found",
            pagination: {
              total,
              page,
              pages: Math.ceil(total / limit),
            },
          },
        };
      }

      return {
        status: 200,
        body: {
          offers: fetchedOffers,
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
    const offers = await OfferModel.find({ _id: { $in: ids } });

    if (!offers.length) {
      return {
        status: 200,
        body: {
          offers: [],
          msg: "No offers found",
        },
      };
    }
    return {
      status: 200,
      body: {
        offers: offers,
        msg: "Offers fetched successfully",
      },
    };
  },
  getOffer: async ({ params }) => {
    try {
      const offer = await OfferModel.findById(params.id);

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
          offer,
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
});
