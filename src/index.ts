import "dotenv/config";

import app from "./app";
import { env } from "./config/env";
import db from "./config/database";

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});


let isShutdown = false;
const shutdown = async (signal: string) => {

  if (isShutdown) {
    return;
  }
  isShutdown = true;

  console.log(`${signal} received, Shutting down the server...`);

  const forceShutdownTimer = setTimeout(() => {
    console.log("Force shutdown");
    process.exit(1);
  }, 30_000)


  server.close(async () => {
    console.log("Server Closed...");

    try {
      await db.destroy();
      clearTimeout(forceShutdownTimer);
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);