import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const SeminarService = {
  getAll: async () => {
    return prisma.seminar.findMany();
  },

  getById: async (id: number) => {
    return prisma.seminar.findUnique({ where: { id } });
  },

  create: async (title: string, available: number, deadline: Date) => {
    return prisma.seminar.create({
      data: {
        title,
        available,
        deadline,
      },
    });
  },

  update: async (
    id: number,
    data: { title?: string; available?: number; deadline?: string }
  ) => {
    try {
      const updated = await prisma.seminar.update({
        where: { id },
        data,
      });

      return updated;
    } catch (err: any) {
      console.error("Update error:", err);
      throw err;
    }
  },

  remove: async (id: number) => {
    return prisma.seminar.delete({ where: { id } });
  },
};
