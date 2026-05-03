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
    ch.

  }

