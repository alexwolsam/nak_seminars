-- CreateEnum
CREATE TYPE "public"."EnrollmentStatus" AS ENUM ('PARTICIPATING', 'WAITLISTED');

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

-- CreateTable
CREATE TABLE "public"."Enrollment" (
    "id" SERIAL NOT NULL,
    "seminarId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."EnrollmentStatus" NOT NULL DEFAULT 'PARTICIPATING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WaitlistEntry" (
    "id" TEXT NOT NULL,
    "seminarId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Enrollment_userId_idx" ON "public"."Enrollment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_seminarId_userId_key" ON "public"."Enrollment"("seminarId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_seminarId_fkey" FOREIGN KEY ("seminarId") REFERENCES "public"."Seminar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
