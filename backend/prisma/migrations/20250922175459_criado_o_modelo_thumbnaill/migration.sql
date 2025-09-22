-- CreateTable
CREATE TABLE "public"."Thumbnaill" (
    "id" TEXT NOT NULL,
    "idUser" TEXT,

    CONSTRAINT "Thumbnaill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Thumbnaill" ADD CONSTRAINT "Thumbnaill_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
