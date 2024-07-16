import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import { connect } from "mongoose";
import { json } from "body-parser";
import cors from "cors";
const port = process.env.PORT || 5000;
import * as trpcExpress from "@trpc/server/adapters/express";
import { mainRouter } from "./routes/_app";

const app: Express = express();

app.use(json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      // process.env.CORS_URI as string
    ],
  })
);

connect(process.env.MONGO_URI as string, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: mainRouter,
  })
);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
