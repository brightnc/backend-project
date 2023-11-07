/*
  Warnings:

  - The primary key for the `BlackListToken` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "BlackListToken" DROP CONSTRAINT "BlackListToken_pkey",
ALTER COLUMN "token" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "BlackListToken_pkey" PRIMARY KEY ("token");
