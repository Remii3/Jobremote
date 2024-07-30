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

const app: Express = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      // process.env.CORS_URI as string
    ],
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

createExpressEndpoints(mainContract, mainRouter, app);

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
