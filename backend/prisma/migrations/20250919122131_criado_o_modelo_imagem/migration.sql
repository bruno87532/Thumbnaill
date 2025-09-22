-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
