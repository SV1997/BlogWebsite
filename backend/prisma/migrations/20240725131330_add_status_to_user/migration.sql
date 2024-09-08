/*
  Warnings:

  - You are about to drop the column `profileImage` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "profileImage",
ADD COLUMN     "Image" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "status" TEXT;
