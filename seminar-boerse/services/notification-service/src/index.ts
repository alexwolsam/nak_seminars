import express from "express";
import amqp from "amqplib";
import nodemailer from "nodemailer";
import type { Event } from "./types/event";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MQ_SERVER_URL = process.env.MQ_SERVER_URL || "amqp://localhost";

const app = express();

app.use(express.json());

// Mailer Setup (SMTP z. B. über Mailserver oder Gmail)
const transporter = nodemailer.createTransport({
  service: "SMTP",
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "1025"),
  secure: false,
});

async function handleEvent(event: Event) {
  await prisma.notification.create({
    data: {
      userId: event.payload.userId,
      type: event.type,
      payload: event.payload as any,
    },
  });
  switch (event.type) {
    case "USER_ADDED_TO_QUEUE":
      await transporter.sendMail({
        from: '"Seminarbörse" <no-reply@nak.de>',
        to: event.payload.email,
        subject: "⏳ Warteliste",
        html: userAddedToQueueMail(
          event.payload.userName,
          event.payload.seminarName,
          event.payload.seminarId.toString()
        ),
      });
      break;

    case "USER_REMOVED_FROM_QUEUE":
      await transporter.sendMail({
        from: '"Seminarbörse" <no-reply@nak.de>',
        to: event.payload.email,
        subject: "ℹ️ Warteliste verlassen",
        html: userRemovedFromQueueMail(
          event.payload.userName,
          event.payload.seminarName,
          event.payload.seminarId.toString()
        ),
      });
      break;

    case "SEMINAR_JOINED_FROM_QUEUE":
      await transporter.sendMail({
        from: '"Seminarbörse" <no-reply@nak.de>',
        to: event.payload.email,
        subject: "🎉 Du bist nachgerückt",
        html: seminarJoinedFromQueueMail(
          event.payload.userName,
          event.payload.seminarName,
          event.payload.seminarId.toString()
        ),
      });
      break;

    case "ENROLLMENT_CONFIRMED":
      await transporter.sendMail({
        from: '"Seminarbörse" <no-reply@nak.de>',
        to: event.payload.email,
        subject: "✅ Anmeldung bestätigt",
        html: enrollmentConfirmedMail(
          event.payload.userName,
          event.payload.seminarName,
          event.payload.seminarId
        ),
      });
      await prisma.notification.create({
        data: {
          userId: event.payload.userId,
          type: event.type,
          payload: event.payload as any,
        },
      });
      break;
    case "ENROLLMENT_CANCELLED":
      await transporter.sendMail({
        from: '"Seminarbörse" <no-reply@nak.de>',
        to: event.payload.email,
        subject: "❌ Abmeldung bestätigt",
        html: enrollmentCancelledMail(
          event.payload.userName,
          event.payload.seminarName,
          event.payload.seminarId
        ),
      });
      await prisma.notification.create({
        data: {
          userId: event.payload.userId,
          type: event.type,
          payload: event.payload as any,
        },
      });
      break;
  }
}

async function startConsumer() {
  while (true) {
    try {
      const conn = await amqp.connect(MQ_SERVER_URL);
      console.log("Connected to MQ Server");
      const channel = await conn.createChannel();
      const queue = "notifications";

      await channel.assertQueue(queue, { durable: true });
      console.log(`Warte auf Events in Queue: ${queue}`);

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const event = JSON.parse(msg.content.toString());
          console.log("Event empfangen:", event);
          try {
            await handleEvent(event);
          } catch (e) {
            console.log(e);
          }
          channel.ack(msg);
        }
      });
      return true;
    } catch (err) {
      console.error("⚠️ MQ connection failed, retrying in 2s...");
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "seminar-service" });
});
app.get("/", async (_req, res) => {
  const userId = _req.header("x-user-id");
  const notifications = await prisma.notification.findMany({
    where: { userId: userId },
  });
  await prisma.notification.deleteMany({
    where: { userId: userId },
  });
  res.json(notifications);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Notification-Service läuft auf Port ${PORT}`);
  await startConsumer();
});

function enrollmentConfirmedMail(
  userName: string,
  seminarName: string,
  seminarId: Number
) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; background:#f7f9fc; margin:0; padding:0; }
      .container { max-width:600px; margin:40px auto; background:#fff; border-radius:12px;
                   box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; }
      .header { background:#66c2f5; color:#fff; padding:20px; text-align:center; }
      .header h1 { margin:0; font-size:22px; }
      .content { padding:30px; color:#333; line-height:1.6; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px;
                background:#66c2f5; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; }
      .footer { background:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#777; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Anmeldung bestätigt 🎓</h1></div>
      <div class="content">
        <p>Hallo ${userName},</p>
        <p>deine Anmeldung zum Seminar <strong>${seminarName}</strong> wurde erfolgreich bestätigt.</p>
        <p>Wir freuen uns auf deine Teilnahme!</p>
        <a class="button" href="https://seminar.nak.de/seminars/">Zur Seminarübersicht</a>
      </div>
      <div class="footer">
        <p>Dies ist eine automatische Nachricht der Seminarbörse. Bitte nicht direkt antworten.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
function enrollmentCancelledMail(
  userName: string,
  seminarName: string,
  seminarId: Number
) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; background:#f7f9fc; margin:0; padding:0; }
      .container { max-width:600px; margin:40px auto; background:#fff; border-radius:12px;
                   box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; }
      .header { background:#66c2f5; color:#fff; padding:20px; text-align:center; }
      .header h1 { margin:0; font-size:22px; }
      .content { padding:30px; color:#333; line-height:1.6; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px;
                background:#66c2f5; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; }
      .footer { background:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#777; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Abmeldung bestätigt ❌</h1></div>
      <div class="content">
        <p>Hallo ${userName},</p>
        <p>du hast dich erfolgreich vom Seminar <strong>${seminarName}</strong> abgemeldet.</p>
        <p>Falls dies ein Irrtum war, kannst du dich jederzeit erneut anmelden, solange Plätze verfügbar sind.</p>
        <a class="button" href="https://seminar.nak.de/seminars/">Zur Seminarübersicht</a>
      </div>
      <div class="footer">
        <p>Dies ist eine automatische Nachricht der Seminarbörse. Bitte nicht direkt antworten.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

function userAddedToQueueMail(
  userName: string,
  seminarName: string,
  seminarId: string
) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; background:#f7f9fc; margin:0; padding:0; }
      .container { max-width:600px; margin:40px auto; background:#fff; border-radius:12px;
                   box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; }
      .header { background:#66c2f5; color:#fff; padding:20px; text-align:center; }
      .header h1 { margin:0; font-size:22px; }
      .content { padding:30px; color:#333; line-height:1.6; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px;
                background:#66c2f5; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; }
      .footer { background:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#777; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Warteliste ⏳</h1></div>
      <div class="content">
        <p>Hallo ${userName},</p>
        <p>das Seminar <strong>${seminarName}</strong> ist aktuell voll.</p>
        <p>Du wurdest erfolgreich auf die Warteliste gesetzt und wirst benachrichtigt, sobald ein Platz frei wird.</p>
        <a class="button" href="https://seminar.nak.de/seminars/${seminarId}">Zur Seminarübersicht</a>
      </div>
      <div class="footer">
        <p>Dies ist eine automatische Nachricht der Seminarbörse. Bitte nicht direkt antworten.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

function userRemovedFromQueueMail(
  userName: string,
  seminarName: string,
  seminarId: string
) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; background:#f7f9fc; margin:0; padding:0; }
      .container { max-width:600px; margin:40px auto; background:#fff; border-radius:12px;
                   box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; }
      .header { background:#66c2f5; color:#fff; padding:20px; text-align:center; }
      .header h1 { margin:0; font-size:22px; }
      .content { padding:30px; color:#333; line-height:1.6; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px;
                background:#66c2f5; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; }
      .footer { background:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#777; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Warteliste verlassen ℹ️</h1></div>
      <div class="content">
        <p>Hallo ${userName},</p>
        <p>du wurdest von der Warteliste für das Seminar <strong>${seminarName}</strong> entfernt.</p>
        <p>Wenn du weiterhin teilnehmen möchtest, melde dich erneut an, solange Plätze verfügbar sind.</p>
        <a class="button" href="https://seminar.nak.de/seminars/${seminarId}">Zur Seminarübersicht</a>
      </div>
      <div class="footer">
        <p>Dies ist eine automatische Nachricht der Seminarbörse. Bitte nicht direkt antworten.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

function seminarJoinedFromQueueMail(
  userName: string,
  seminarName: string,
  seminarId: string
) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; background:#f7f9fc; margin:0; padding:0; }
      .container { max-width:600px; margin:40px auto; background:#fff; border-radius:12px;
                   box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; }
      .header { background:#66c2f5; color:#fff; padding:20px; text-align:center; }
      .header h1 { margin:0; font-size:22px; }
      .content { padding:30px; color:#333; line-height:1.6; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px;
                background:#66c2f5; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; }
      .footer { background:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#777; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Nachgerückt 🎉</h1></div>
      <div class="content">
        <p>Hallo ${userName},</p>
        <p>gute Nachrichten: du bist von der Warteliste in das Seminar <strong>${seminarName}</strong> nachgerückt!</p>
        <p>Dein Platz ist jetzt sicher ✅</p>
        <a class="button" href="https://seminar.nak.de/seminars/${seminarId}">Seminar ansehen</a>
      </div>
      <div class="footer">
        <p>Dies ist eine automatische Nachricht der Seminarbörse. Bitte nicht direkt antworten.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
