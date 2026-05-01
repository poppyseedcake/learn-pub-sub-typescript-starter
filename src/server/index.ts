import amqp from "amqplib";
import { publishJSON } from "../internal/pubsub/publish.js";
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";
import { getInput, printServerHelp } from "../internal/gamelogic/gamelogic.js";

async function main() {
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);
  console.log("Peril game server connected to RabbitMQ!");

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

  const publishCh = await conn.createConfirmChannel();

  try {
    await publishJSON(publishCh, ExchangePerilDirect, PauseKey, {
      isPaused: true,
    });
  } catch (err) {
    console.error("Error publishing message:", err);
  }

  printServerHelp();
  while (1) {
    const input = await getInput();
    if (input.length === 0) {
      continue;
    }
    if (input[0] === "pause") {
      console.log("Sending pause message..");
      try {
        await publishJSON(publishCh, ExchangePerilDirect, PauseKey, {
          isPaused: true,
        });
      } catch (err) {
        console.error("Error publishing message:", err);
      }

    } else if (input[0] === "resume") {
      console.log("Sending resume message..");
      try {
        await publishJSON(publishCh, ExchangePerilDirect, PauseKey, {
          isPaused: false,
        });
      } catch (err) {
        console.error("Error publishing message:", err);
      }

    } else if (input[0] === "quit") {
      console.log("Exiting...");
      break;
    } else {
      console.log("WTF do you mean?");
    }
  }

}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
