import amqp from "amqplib";
import { declareAndBind, SimpleQueueType } from "./consume.js";

export async function subscribeJSON<T>(
    conn: amqp.ChannelModel,
    exchange: string,
    queueName: string,
    key: string,
    queueType: SimpleQueueType,
    handler: (data: T) => void,
  ): Promise<void> {
    const [ch, queue] = await declareAndBind(conn, exchange, queueName, key, queueType);
    await ch.consume(queue.queue, (msg: amqp.ConsumeMessage | null) => {
        if (msg === null) return;
        const parsed = JSON.parse(msg.content.toString());
        handler(parsed);
        ch.ack(msg);
    })

  }

