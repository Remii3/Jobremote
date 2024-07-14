import { Request, Response } from "express";
import Offer from "../models/Offer.model";
import redisClient from "../utils/redisClient";

export const createOffer = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    console.log(req.body);
    if (!title || !description) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    const offer = new Offer({
      title,
      description,
    });
    await offer.save();
    res.status(201).json({ offer, msg: "Offer created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const getOffers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    const offersKey = `offers:${page}:${limit}`;
    const totalKey = "offers:total";

    const cachedOffers = await redisClient.get(offersKey);
    const cachedTotal = await redisClient.get(totalKey);
    if (cachedOffers && cachedTotal) {
      return res.status(200).json({
        offers: JSON.parse(cachedOffers),
        msg: "Offers fetched successfully from cache",
        pagination: {
          total: parseInt(cachedTotal),
          page,
          pages: Math.ceil(parseInt(cachedTotal) / limit),
        },
        fromCache: true,
      });
    }
    const [offers, total] = await Promise.all([
      Offer.find().skip(skip).limit(limit),
      Offer.countDocuments(),
    ]);

    if (!offers.length) {
      return res.status(404).json({ msg: "No offers found" });
    }

    await Promise.all([
      redisClient.setEx(offersKey, 3600, JSON.stringify(offers)),
      redisClient.setEx(totalKey, 3600, total.toString()),
    ]);

    res.json({
      offers,
      msg: "Offers fetched successfully",
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.log("Get offers", err);
    res.status(500).json({ msg: "Server Error" });
  }
};
