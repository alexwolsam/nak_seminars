import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getClientFIFO(seminarId: string) {
  return await prisma.waitlistEntry.findFirst({
    where: { seminarId: seminarId.toString() },
    orderBy: { createdAt: "asc" },
  });
}
