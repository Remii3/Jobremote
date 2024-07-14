import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import { connect } from "mongoose";
import { offerRouter } from "./routes/offer.routes";
import { json } from "body-parser";

const port = process.env.PORT || 5000;

const app: Express = express();

app.use(json());

app.use(offerRouter);

connect(process.env.MONGO_URI as string, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
