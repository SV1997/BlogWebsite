/*
  Warnings:

  - Changed the type of `published` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published",
ADD COLUMN     "published" TIMESTAMP(3) NOT NULL;
