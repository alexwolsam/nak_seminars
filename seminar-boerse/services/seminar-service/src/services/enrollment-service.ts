// src/services/enrollment-service.ts
import { PrismaClient, EnrollmentStatus } from "@prisma/client";
import {
  publishNotificationEvent,
  publishSeminarEvent,
} from "../event-publisher";
const prisma = new PrismaClient();

export const EnrollmentService = {
  enroll: async (
    seminarId: number,
    userId: string,
    userName: string,
    email: string
  ) => {
    return prisma.$transaction(async (tx) => {
      const seminar = await tx.seminar.findUnique({ where: { id: seminarId } });
      if (!seminar) throw new Error("seminar_not_found");

      const exists = await tx.enrollment.findUnique({
        where: { seminarId_userId: { seminarId, userId } },
      });
      if (exists) return exists;

      if (seminar.available > 0) {
        const e = await tx.enrollment.create({
          data: { seminarId, userId, status: EnrollmentStatus.PARTICIPATING },
        });
        await tx.seminar.update({
          where: { id: seminarId },
          data: { available: { decrement: 1 } },
        });
        await publishNotificationEvent({
          type: "ENROLLMENT_CONFIRMED",
          payload: {
            userId,
            userName,
            email,
            seminarId,
            seminarName: seminar.title,
          },
        });
        return e;
      } else {
        await publishSeminarEvent({
          type: "USER_TO_QUEUE",
          payload: {
            userId,
            userName,
            email,
            seminarId,
            seminarName: seminar.title,
          },
        });
        await publishNotificationEvent({
          type: "USER_ADDED_TO_QUEUE",
          payload: {
            userId,
            userName,
            email,
            seminarId,
            seminarName: seminar.title,
          },
        });
      }
    });
  },

  leave: async (
    seminarId: number,
    userId: string,
    userName: string,
    email: string
  ) => {
    return prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.findUnique({
        where: { seminarId_userId: { seminarId, userId } },
      });
      const waitlisted = await tx.waitlistEntry.findFirst({
        where: { seminarId: seminarId.toString(), userId },
      });
      if (enrollment) {
        // löschen
        await tx.enrollment.delete({
          where: { id: enrollment.id },
        });
        await tx.seminar.update({
          where: { id: seminarId },
          data: { available: { increment: 1 } },
        });
        await publishNotificationEvent({
          type: "ENROLLMENT_CANCELLED",
          payload: {
            userId,
            userName,
            email,
            seminarId,
            seminarName: "",
          },
        });
        await publishSeminarEvent({
          type: "USER_CANCELLED_ENROLLMENT",
          payload: {
            userId,
            userName,
            email,
            seminarId,
            seminarName: "",
          },
        });

        return { ok: true };
      } else if (waitlisted) {
        await tx.waitlistEntry.delete({
          where: { id: waitlisted.id },
        });
        await publishNotificationEvent({
          type: "USER_DELETE_FROM_QUEUE",
          payload: {
            userId,
            userName,
            email,
            seminarId,
            seminarName: "",
          },
        });
        return { ok: true };
      }
      throw new Error("not_enrolled");
    });
  },

  myEnrollments: async (userId: string) => {
    let seminars = [];
    const enrolledSeminars = await prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    seminars = enrolledSeminars.map((e) => ({
      seminarId: e.seminarId,
      status: "enrolled",
    }));
    const waitlistSeminars = await prisma.waitlistEntry.findMany({
      where: { userId },
    });
    seminars = seminars.concat(
      waitlistSeminars.map((w) => ({
        seminarId: parseInt(w.seminarId),
        status: "queue",
      }))
    );
    return seminars;
  },

  listBySeminar: async (seminarId: number) => {
    return prisma.enrollment.findMany({
      where: { seminarId },
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    });
  },
};
