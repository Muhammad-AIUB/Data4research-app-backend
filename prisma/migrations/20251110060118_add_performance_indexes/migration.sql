-- CreateIndex
CREATE INDEX "investigation_sessions_investigation_date_idx" ON "investigation_sessions"("investigation_date");

-- CreateIndex
CREATE INDEX "investigation_sessions_patient_id_investigation_date_idx" ON "investigation_sessions"("patient_id", "investigation_date");

-- CreateIndex
CREATE INDEX "patients_user_id_created_at_idx" ON "patients"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "patients_user_id_name_idx" ON "patients"("user_id", "name");
