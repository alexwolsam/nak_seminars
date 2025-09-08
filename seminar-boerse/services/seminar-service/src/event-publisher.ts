import amqp from "amqplib";

const MQ_SERVER_URL = process.env.MQ_SERVER_URL || "amqp://localhost";

let channel: amqp.Channel | null = null;

export async function connectQueue() {
  if (channel) return channel;
  const conn = await amqp.connect(MQ_SERVER_URL);
  channel = await conn.createChannel();

  console.log("[Publisher] Connected to RabbitMQ");

  await channel.assertQueue("seminar-events", { durable: true });
  await channel.assertQueue("notifications", { durable: true });
  return channel;
}

export async function publishNotificationEvent(event: Record<string, any>) {
  const ch = await connectQueue();
  ch.sendToQueue("notifications", Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });
  console.log("[Publisher] Notification event published:", event.type);
}

export async function publishSeminarEvent(event: Record<string, any>) {
  const ch = await connectQueue();
  ch.sendToQueue("seminar-events", Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });
  console.log("[Publisher] Seminar event published:", event.type);
}
