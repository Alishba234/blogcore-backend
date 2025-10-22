
import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST, // If using Docker locally
    port: process.env.REDIS_PORT,  // Or 6380 if you mapped to that
  },
});

redisClient.on("connect", () => {
  console.log(" Redis connected successfully");
});

redisClient.on("error", (err) => {
  console.error(" Redis connection error:", err);
});

// Connect immediately when this file is imported
await redisClient.connect();

export default redisClient;
