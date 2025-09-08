import amqp from "amqplib";
import { PrismaClient } from "@prisma/client";
import { getClientFIFO } from "./queue-strategies/fifo-strat";

const prisma = new PrismaClient();
const MQ_SERVER_URL = process.env.MQ_SERVER_URL || "amqp://localhost";
const QUEUE = "seminar-events";

async function startQueueConsumer() {
  const conn = await amqp.connect(MQ_SERVER_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  console.log(`📥 Queue-Service hört auf Events in ${QUEUE}`);

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString());

    switch (event.type) {
      case "USER_TO_QUEUE": {
        console.log("➡️ User soll auf Warteliste:", event.payload);
        const userInQueue = await prisma.waitlistEntry.findFirst({
          where: {
            userId: event.payload.userId,
            seminarId: event.payload.seminarId.toString(),
          },
        });
        if (!userInQueue) {
          await prisma.waitlistEntry.create({
            data: {
              userId: event.payload.userId,
              seminarId: event.payload.seminarId.toString(),
            },
          });
          console.log(
            `✅ User ${event.payload.userId} wurde für Seminar ${event.payload.seminarId} auf die Warteliste gesetzt`
          );
        }
        break;
      }

      case "USER_CANCELLED_ENROLLMENT": {
        console.log("➡️ User hat seine Anmeldung storniert:", event.payload);
        const waitlistCandidate = await getClientFIFO(event.payload.seminarId);
        if (waitlistCandidate) {
          await prisma.waitlistEntry.delete({
            where: { id: waitlistCandidate.id },
          });
          console.log(
            `✅ User ${waitlistCandidate.userId} wurde von der Warteliste entfernt`
          );
          await prisma.enrollment.create({
            data: {
              userId: waitlistCandidate!!.userId,
              seminarId: event.payload.seminarId.toString(),
            },
          });
        }
        break;
      }
      case "USER_DELETE_FROM_QUEUE": {
        console.log(
          "➡️ User soll von Warteliste entfernt werden:",
          event.payload
        );
        await prisma.waitlistEntry.deleteMany({
          where: {
            userId: event.payload.userId,
            seminarId: event.payload.seminarId.toString(),
          },
        });
        break;
      }
    }
    channel.ack(msg);
  });
}

async function autoRestartQueue() {
  while (true) {
    try {
      await startQueueConsumer();
      break; // Exit the loop if startQueueConsumer completes successfully
    } catch (error) {
      console.error("Queue consumer crashed, restarting...", error);
      await new Promise((res) => setTimeout(res, 5000)); // Wait for 5 seconds before restarting
    }
  }
}

autoRestartQueue();
