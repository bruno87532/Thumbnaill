-- CreateEnum
CREATE TYPE "public"."config" AS ENUM ('BLOCK_LOW_AND_ABOVE', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_NONE', 'BLOCK_ONLY_HIGH', 'HARM_BLOCK_THRESHOLD_UNSPECIFIED', 'OFF');

-- CreateTable
CREATE TABLE "public"."Config" (
    "id" TEXT NOT NULL,
    "civicIntegrity" "public"."config" NOT NULL DEFAULT 'OFF',
    "dangerousContent" "public"."config" NOT NULL DEFAULT 'OFF',
    "harassmentIntimidation" "public"."config" NOT NULL DEFAULT 'OFF',
    "hateSpeech" "public"."config" NOT NULL DEFAULT 'OFF',
    "sexual" "public"."config" NOT NULL DEFAULT 'OFF',

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);
