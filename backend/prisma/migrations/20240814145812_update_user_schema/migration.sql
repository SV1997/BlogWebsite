/*
  Warnings:

  - You are about to drop the column `userRequested` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `userRequesting` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "userRequested",
DROP COLUMN "userRequesting",
ADD COLUMN     "requestRecieved" TEXT[],
ADD COLUMN     "requestSend" TEXT[];
