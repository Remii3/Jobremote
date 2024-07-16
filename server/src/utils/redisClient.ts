import { createClient } from "redis";
import { handleError } from "./utils";

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
  disableOfflineQueue: true,
});

client.on("error", (err) => {
  handleError(err);
});

client.connect();

export default client;
