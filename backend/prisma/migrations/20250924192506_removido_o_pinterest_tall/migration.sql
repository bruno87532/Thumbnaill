/*
  Warnings:

  - The values [PINTEREST_TALL] on the enum `ratio` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ratio_new" AS ENUM ('YOUTUBE', 'INSTAGRAM_TIKTOK', 'INSTAGRAM_POST', 'INSTAGRAM_PORTRAIT', 'CINEMATIC', 'PINTEREST');
ALTER TABLE "public"."aspectRatio" ALTER COLUMN "typePost" DROP DEFAULT;
ALTER TABLE "public"."aspectRatio" ALTER COLUMN "typePost" TYPE "public"."ratio_new" USING ("typePost"::text::"public"."ratio_new");
ALTER TYPE "public"."ratio" RENAME TO "ratio_old";
ALTER TYPE "public"."ratio_new" RENAME TO "ratio";
DROP TYPE "public"."ratio_old";
ALTER TABLE "public"."aspectRatio" ALTER COLUMN "typePost" SET DEFAULT 'YOUTUBE';
COMMIT;
