-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MOD', 'ADMIN', 'DEV');

-- CreateEnum
CREATE TYPE "Vote" AS ENUM ('YEA', 'NAY', 'ABS');

-- CreateTable
CREATE TABLE "Account" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'MOD',
    "conventionId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Convention" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roomsOpen" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
"id" SERIAL,
    "name" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "open" BOOLEAN NOT NULL DEFAULT true,
    "votingOpen" BOOLEAN NOT NULL DEFAULT false,
    "byline" TEXT NOT NULL DEFAULT E'A JSA Room',
    "speakers" TEXT[],
    "concluded" BOOLEAN NOT NULL DEFAULT false,
    "yea" INTEGER NOT NULL DEFAULT 0,
    "nay" INTEGER NOT NULL DEFAULT 0,
    "abs" INTEGER NOT NULL DEFAULT 0,
    "bestSpeaker" TEXT,
    "conventionId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voter" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "vote" "Vote",
    "speaker" TEXT,
    "roomId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account.token_unique" ON "Account"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Room.accessCode_unique" ON "Room"("accessCode");

-- AddForeignKey
ALTER TABLE "Account" ADD FOREIGN KEY("conventionId")REFERENCES "Convention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD FOREIGN KEY("conventionId")REFERENCES "Convention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD FOREIGN KEY("roomId")REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
