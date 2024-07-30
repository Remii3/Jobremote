import { offersContract } from "../contracts/offers.contract";
import OfferModel, { OfferType } from "../models/Offer.model";
import redisClient from "../utils/redisClient";
import { tsServer } from "../utils/utils";

export const offersRouter = tsServer.router(offersContract, {
  createOffer: async ({ body }) => {
    const { title, content, categories } = body;
    try {
      const offer = await OfferModel.create({ title, content, categories });
      return {
        status: 201,
        body: {
          msg: "Your new offer is successfuly posted.",
          offer,
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

      if (query.filters?.categories && query.filters.categories.length > 0) {
        filters.categories = { $in: query.filters.categories };
      }

      if (query.filters?.keyword) {
        filters.$or = [
          { title: { $regex: query.filters.keyword, $options: "i" } },
          { content: { $regex: query.filters.keyword, $options: "i" } },
        ];
      }

      const filtersKey = query.filters
        ? JSON.stringify(query.filters)
        : "no-filters";

      const offersKey = `offers:${page}:${limit}:${filtersKey}`;
      const totalKey = `offers:total:${filtersKey}`;

      const cachedOffers = await redisClient.get(offersKey);
      const cachedTotal = await redisClient.get(totalKey);

      if (cachedOffers && cachedTotal) {
        return {
          status: 200,
          body: {
            offers: JSON.parse(cachedOffers) as OfferType[],
            msg: "Offers fetched successfully from cache",
            pagination: {
              total: parseInt(cachedTotal),
              page,
              pages: Math.ceil(parseInt(cachedTotal) / limit),
            },
            fromCache: true,
          },
        };
      }

      const [fetchedOffers, total]: [fetchedOffers: OfferType[], number] =
        await Promise.all([
          OfferModel.find(filters).skip(skip).limit(limit),
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

      await Promise.all([
        redisClient.setEx(offersKey, 3600, JSON.stringify(fetchedOffers)),
        redisClient.setEx(totalKey, 3600, total.toString()),
      ]);

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
});
