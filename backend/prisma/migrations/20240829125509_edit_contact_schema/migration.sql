/*
  Warnings:

  - Added the required column `friendId` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "friendId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
