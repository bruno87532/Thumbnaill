/*
  Warnings:

  - The values [MEDIA_RESOLUTION_HIGH] on the enum `quality` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."quality_new" AS ENUM ('MEDIA_RESOLUTION_MEDIUM', 'MEDIA_RESOLUTION_LOW');
ALTER TABLE "public"."Config" ALTER COLUMN "qualityMode" DROP DEFAULT;
ALTER TABLE "public"."Config" ALTER COLUMN "qualityMode" TYPE "public"."quality_new" USING ("qualityMode"::text::"public"."quality_new");
ALTER TYPE "public"."quality" RENAME TO "quality_old";
ALTER TYPE "public"."quality_new" RENAME TO "quality";
DROP TYPE "public"."quality_old";
ALTER TABLE "public"."Config" ALTER COLUMN "qualityMode" SET DEFAULT 'MEDIA_RESOLUTION_MEDIUM';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Image" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';
