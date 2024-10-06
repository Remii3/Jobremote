import dotenv from "dotenv";
dotenv.config();
import express, { Express, NextFunction, Request, Response } from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
const port = process.env.PORT || 5000;
import { createExpressEndpoints } from "@ts-rest/express";
import { mainRouter } from "./routes/_app";
import { mainContract } from "jobremotecontracts";
import cookieParser from "cookie-parser";
import OfferModel from "./models/Offer.model";
import { schedule } from "node-cron";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./utils/uploadthing";

const app: Express = express();

app.use(
  cors({
    origin: [process.env.CORS_URI || ""],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  if (req.path === "/webhook") {
    return next();
  }
  bodyParser.json()(req, res, next);
});
app.use(cookieParser());
createExpressEndpoints(mainContract, mainRouter, app);

connect(process.env.MONGO_URI as string, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: { uploadthingSecret: process.env.UPLOADTHING_SECRET },
  })
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging

  res.status(500).json({
    status: 500,
    message: err.message || "Internal Server Error",
  });
});

schedule("0 0 * * *", async () => {
  try {
    const result = await OfferModel.updateMany(
      {
        isPaid: true,
        isDeleted: false,
        activeUntil: { $lte: new Date() },
      },
      {
        $set: { isPaid: false },
      }
    );

    console.log(`${result.modifiedCount} offers disabled.`);
  } catch (err) {
    console.error("Error disabling old offers:", err);
  }
});

app.listen(port, () => {
  console.log(`Server is listening at port:${port}`);
});
