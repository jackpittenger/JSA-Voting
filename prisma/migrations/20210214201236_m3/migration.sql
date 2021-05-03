/*
  Warnings:

  - Added the required column `creatorId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "creatorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD FOREIGN KEY("creatorId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
