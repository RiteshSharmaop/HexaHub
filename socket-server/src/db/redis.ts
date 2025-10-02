import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    // tls: true // 👈 Redis Cloud usually requires TLS
  }
});

client.on("error", (err) => console.error("❌ Redis Client Error", err));

(async () => {
  try {
    await client.connect();
    console.log("✅ Connected to Redis Cloud");

    await client.set("foo", "bar");
    const result = await client.get("foo");
    // console.log("Redis get foo =>", result);
  } catch (err) {
    console.error("Redis Connection Failed:", err);
  }
})();

export {client};
