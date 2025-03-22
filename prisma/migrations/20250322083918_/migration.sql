/*
  Warnings:

  - You are about to drop the column `textZh` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `titleZh` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `translated` on the `Story` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('TOP', 'NEW', 'BEST', 'ASK', 'SHOW', 'JOB');

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "textZh",
DROP COLUMN "titleZh",
DROP COLUMN "translated",
ADD COLUMN     "tags" "Tag"[];
