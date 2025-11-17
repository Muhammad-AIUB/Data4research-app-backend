-- CreateTable
CREATE TABLE "patient_examinations" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "values" JSONB NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_examinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_hematology_panels" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "values" JSONB NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_hematology_panels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_lft_panels" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "values" JSONB NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_lft_panels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_rft_panels" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "values" JSONB NOT NULL,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_rft_panels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "patient_examinations_patient_id_recorded_at_idx" ON "patient_examinations"("patient_id", "recorded_at");

-- CreateIndex
CREATE INDEX "patient_hematology_panels_patient_id_recorded_at_idx" ON "patient_hematology_panels"("patient_id", "recorded_at");

-- CreateIndex
CREATE INDEX "patient_lft_panels_patient_id_recorded_at_idx" ON "patient_lft_panels"("patient_id", "recorded_at");

-- CreateIndex
CREATE INDEX "patient_rft_panels_patient_id_recorded_at_idx" ON "patient_rft_panels"("patient_id", "recorded_at");

-- AddForeignKey
ALTER TABLE "patient_examinations" ADD CONSTRAINT "patient_examinations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_hematology_panels" ADD CONSTRAINT "patient_hematology_panels_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_lft_panels" ADD CONSTRAINT "patient_lft_panels_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_rft_panels" ADD CONSTRAINT "patient_rft_panels_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

