/*
  Warnings:

  - A unique constraint covering the columns `[telegramBotId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "telegramBotId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Service_telegramBotId_key" ON "Service"("telegramBotId");
