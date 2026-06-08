-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('website', 'telegramBot');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('up', 'down', 'pending');

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "ServiceType" NOT NULL,
    "urlOrIdentifier" VARCHAR(500) NOT NULL,
    "isMonitored" BOOLEAN NOT NULL DEFAULT true,
    "status" "Status" NOT NULL,
    "intervalMs" INTEGER NOT NULL DEFAULT 60000,
    "lastCheckedAt" TIMESTAMP(3),
    "lastHeartbeatAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_type_urlOrIdentifier_key" ON "Service"("type", "urlOrIdentifier");
