/*
  Warnings:

  - Made the column `likes` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `published` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "likes" SET NOT NULL;

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "published" TEXT NOT NULL;
