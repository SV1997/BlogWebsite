/*
  Warnings:

  - You are about to drop the column `userArray` on the `contacts` table. All the data in the column will be lost.
  - Added the required column `name` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "userArray",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
