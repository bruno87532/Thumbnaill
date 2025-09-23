-- CreateEnum
CREATE TYPE "public"."quality" AS ENUM ('HIGH', 'MEDIUM');

-- AlterTable
ALTER TABLE "public"."Config" ADD COLUMN     "qualityMode" "public"."quality" NOT NULL DEFAULT 'MEDIUM';
