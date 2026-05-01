import amqp from "amqplib";
import { clientWelcome } from "../internal/gamelogic/gamelogic.js";

async function main() {
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);

  const username = await clientWelcome();

  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, async () => {
      try {
        await conn.close();
        console.log("RabbitMQ connection closed.");
      } catch (err) {
        console.error("Error closing RabbitMQ connection:", err);
      } finally {
        process.exit(0);
      }
    }),
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
