import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
const port = process.env.PORT || 5000;
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { mainRouter } from "./routes/_app";
import { mainContract } from "./contracts/_app";
import cookieParser from "cookie-parser";
import OfferModel from "./models/Offer.model";
import { schedule } from "node-cron";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./utils/uploadthing";
const app: Express = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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

schedule("0 0 * * *", async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const result = await OfferModel.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: thirtyDaysAgo },
    });

    console.log(`${result.deletedCount} offers deleted permanently.`);
  } catch (err) {
    console.error("Error deleting expired offers:", err);
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
