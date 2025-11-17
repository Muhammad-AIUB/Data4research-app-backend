-- DropIndex
DROP INDEX "investigation_sessions_investigation_date_idx";

-- DropIndex
DROP INDEX "investigation_sessions_patient_id_investigation_date_idx";

-- DropIndex
DROP INDEX "patients_user_id_created_at_idx";

-- DropIndex
DROP INDEX "patients_user_id_name_idx";

-- CreateTable
CREATE TABLE "patient_images" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,
    "image_type" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investigation_images" (
    "id" TEXT NOT NULL,
    "investigation_id" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,
    "image_type" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investigation_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "patient_images_patient_id_idx" ON "patient_images"("patient_id");

-- CreateIndex
CREATE INDEX "investigation_images_investigation_id_idx" ON "investigation_images"("investigation_id");

-- AddForeignKey
ALTER TABLE "patient_images" ADD CONSTRAINT "patient_images_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investigation_images" ADD CONSTRAINT "investigation_images_investigation_id_fkey" FOREIGN KEY ("investigation_id") REFERENCES "investigation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
