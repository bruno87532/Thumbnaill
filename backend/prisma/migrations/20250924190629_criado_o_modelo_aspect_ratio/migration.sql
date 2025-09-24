-- CreateEnum
CREATE TYPE "public"."ratio" AS ENUM ('YOUTUBE', 'INSTAGRAM_TIKTOK', 'INSTAGRAM_POST', 'INSTAGRAM_PORTRAIT', 'CINEMATIC', 'PINTEREST', 'PINTEREST_TALL');

-- CreateTable
CREATE TABLE "public"."aspectRatio" (
    "id" TEXT NOT NULL,
    "typePost" "public"."ratio" NOT NULL DEFAULT 'YOUTUBE',

    CONSTRAINT "aspectRatio_pkey" PRIMARY KEY ("id")
);
