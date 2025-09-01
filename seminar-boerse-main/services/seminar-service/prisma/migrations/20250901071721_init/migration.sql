-- CreateTable
CREATE TABLE "public"."Seminar" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "available" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seminar_pkey" PRIMARY KEY ("id")
);
