/*
  Warnings:

  - You are about to drop the column `chatId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "chatId",
DROP COLUMN "content";
