import OfferModel, { OfferType } from "../models/Offer.model";
import { publicProcedure, router } from "../utils/trpc";
import { handleError } from "../utils/utils";
import { getOffersSchema, newOfferSchema } from "../schemas/offerSchemas";
import redisClient from "../utils/redisClient";

export const offersRouter = router({
  offers: {
    getOffers: publicProcedure.input(getOffersSchema).query(async (opts) => {
      const page = parseInt(opts.input.page as string) || 1;
      const limit = parseInt(opts.input.limit as string) || 10;
      const skip = (page - 1) * limit;
      try {
        const offersKey = `offers:${page}:${limit}`;
        const totalKey = "offers:total";

        const cachedOffers = await redisClient.get(offersKey);
        const cachedTotal = await redisClient.get(totalKey);
        if (cachedOffers && cachedTotal) {
          return {
            offers: JSON.parse(cachedOffers) as OfferType[],
            msg: "Offers fetched successfully from cache",
            pagination: {
              total: parseInt(cachedTotal),
              page,
              pages: Math.ceil(parseInt(cachedTotal) / limit),
            },
            fromCache: true,
          };
        }
        const [fetchedOffers, total]: [fetchedOffers: OfferType[], number] =
          await Promise.all([
            OfferModel.find().skip(skip).limit(limit),
            OfferModel.countDocuments(),
          ]);

        if (!fetchedOffers.length) {
          return {
            offers: fetchedOffers,
            msg: "No offers found",
            pagination: {
              total,
              page,
              pages: Math.ceil(total / limit),
            },
          };
        }

        await Promise.all([
          redisClient.setEx(offersKey, 3600, JSON.stringify(fetchedOffers)),
          redisClient.setEx(totalKey, 3600, total.toString()),
        ]);

        return {
          offers: fetchedOffers,
          msg: "Offers fetched successfully",
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
          },
        };
      } catch (err) {
        handleError(err, "We failed to get you available offers.");
      }
    }),
    createOffer: publicProcedure
      .input(newOfferSchema)
      .mutation(async (opts) => {
        try {
          const { title, description } = opts.input;
          const offer = new OfferModel({
            title,
            description,
          });
          await offer.save();
          return { msg: "Your new offer is successfuly posted.", offer };
        } catch (err) {
          handleError(err, "We failed to add your new offer.");
        }
      }),
  },
});
