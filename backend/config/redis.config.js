const redis = require("redis");
require("dotenv").config();

const connectRedis = async () => {
  const client = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
    },
  });

  client.on("error", (err) => {
    console.error("Redis error:", err);
  });

  client.on("connect", () => {});

  try {
    await client.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }

  return client;
};

module.exports = connectRedis;
