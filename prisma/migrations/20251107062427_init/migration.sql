-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "ethnicity" TEXT,
    "religion" TEXT,
    "nid_number" TEXT,
    "patient_mobile" TEXT,
    "spouse_mobile" TEXT,
    "relative_mobile" TEXT,
    "address" TEXT,
    "district" TEXT,
    "short_history" TEXT,
    "surgical_history" TEXT,
    "family_history" TEXT,
    "past_illness" TEXT,
    "tags" TEXT[],
    "special_notes" TEXT,
    "final_diagnosis" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investigation_sessions" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "investigation_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investigation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hematology_results" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "test_name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "is_favourite" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hematology_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lft_results" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "test_name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "test_method" TEXT,
    "is_favourite" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lft_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rft_results" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "test_name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "is_favourite" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rft_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "patients_user_id_idx" ON "patients"("user_id");

-- CreateIndex
CREATE INDEX "patients_name_idx" ON "patients"("name");

-- CreateIndex
CREATE INDEX "patients_patient_mobile_idx" ON "patients"("patient_mobile");

-- CreateIndex
CREATE UNIQUE INDEX "patients_user_id_patient_id_key" ON "patients"("user_id", "patient_id");

-- CreateIndex
CREATE INDEX "investigation_sessions_patient_id_idx" ON "investigation_sessions"("patient_id");

-- CreateIndex
CREATE INDEX "hematology_results_session_id_idx" ON "hematology_results"("session_id");

-- CreateIndex
CREATE INDEX "lft_results_session_id_idx" ON "lft_results"("session_id");

-- CreateIndex
CREATE INDEX "rft_results_session_id_idx" ON "rft_results"("session_id");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investigation_sessions" ADD CONSTRAINT "investigation_sessions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hematology_results" ADD CONSTRAINT "hematology_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "investigation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lft_results" ADD CONSTRAINT "lft_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "investigation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rft_results" ADD CONSTRAINT "rft_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "investigation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
