/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `Convention`. If there are existing duplicate values, the migration will fail.
  - Added the required column `name` to the `Convention` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Convention" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Convention.name_unique" ON "Convention"("name");
