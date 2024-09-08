/*
  Warnings:

  - You are about to drop the column `authorId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `_userConversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userArray` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_userConversation" DROP CONSTRAINT "_userConversation_A_fkey";

-- DropForeignKey
ALTER TABLE "_userConversation" DROP CONSTRAINT "_userConversation_B_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_authorId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "authorId";

-- DropTable
DROP TABLE "_userConversation";

-- DropTable
DROP TABLE "userArray";

-- CreateTable
CREATE TABLE "_userArray" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_userArray_AB_unique" ON "_userArray"("A", "B");

-- CreateIndex
CREATE INDEX "_userArray_B_index" ON "_userArray"("B");

-- AddForeignKey
ALTER TABLE "_userArray" ADD CONSTRAINT "_userArray_A_fkey" FOREIGN KEY ("A") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userArray" ADD CONSTRAINT "_userArray_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
