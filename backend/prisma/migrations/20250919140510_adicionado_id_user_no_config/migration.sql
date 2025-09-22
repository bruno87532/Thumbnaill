/*
  Warnings:

  - A unique constraint covering the columns `[idUser]` on the table `Config` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idUser` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Config" ADD COLUMN     "idUser" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Config_idUser_key" ON "public"."Config"("idUser");

-- AddForeignKey
ALTER TABLE "public"."Config" ADD CONSTRAINT "Config_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
