-- Step 1: Add new columns as nullable first (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='patients' AND column_name='date_of_birth') THEN
        ALTER TABLE "patients" ADD COLUMN "date_of_birth" DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='patients' AND column_name='first_degree_relative_mobile') THEN
        ALTER TABLE "patients" ADD COLUMN "first_degree_relative_mobile" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='patients' AND column_name='address_details') THEN
        ALTER TABLE "patients" ADD COLUMN "address_details" TEXT;
    END IF;
END $$;

-- Step 2: Migrate data from old columns to new ones (only if old columns exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='patients' AND column_name='relative_mobile') THEN
        UPDATE "patients" 
        SET "first_degree_relative_mobile" = COALESCE("relative_mobile", "first_degree_relative_mobile")
        WHERE "first_degree_relative_mobile" IS NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='patients' AND column_name='address') THEN
        UPDATE "patients" 
        SET "address_details" = COALESCE("address", "address_details")
        WHERE "address_details" IS NULL;
    END IF;
END $$;

-- Step 3: Set default values for existing rows that will become required
UPDATE "patients" 
SET "date_of_birth" = COALESCE("date_of_birth", CURRENT_DATE - (INTERVAL '1 year' * GREATEST("age", 0)))
WHERE "date_of_birth" IS NULL;

UPDATE "patients" 
SET "ethnicity" = COALESCE("ethnicity", 'Other')
WHERE "ethnicity" IS NULL;

UPDATE "patients" 
SET "religion" = COALESCE("religion", 'Islam')
WHERE "religion" IS NULL;

UPDATE "patients" 
SET "patient_mobile" = COALESCE("patient_mobile", '01000000000')
WHERE "patient_mobile" IS NULL;

UPDATE "patients" 
SET "first_degree_relative_mobile" = COALESCE("first_degree_relative_mobile", '01000000000')
WHERE "first_degree_relative_mobile" IS NULL;

UPDATE "patients" 
SET "district" = COALESCE("district", 'Dhaka')
WHERE "district" IS NULL;

UPDATE "patients" 
SET "short_history" = COALESCE("short_history", 'Not provided')
WHERE "short_history" IS NULL;

UPDATE "patients" 
SET "surgical_history" = COALESCE("surgical_history", 'Not provided')
WHERE "surgical_history" IS NULL;

UPDATE "patients" 
SET "family_history" = COALESCE("family_history", 'Not provided')
WHERE "family_history" IS NULL;

UPDATE "patients" 
SET "past_illness" = COALESCE("past_illness", 'Not provided')
WHERE "past_illness" IS NULL;

UPDATE "patients" 
SET "special_notes" = COALESCE("special_notes", 'Not provided')
WHERE "special_notes" IS NULL;

UPDATE "patients" 
SET "final_diagnosis" = COALESCE("final_diagnosis", 'Not provided')
WHERE "final_diagnosis" IS NULL;

-- Step 4: Change column types for text fields that should be TEXT (for longer content)
-- This is safe even if already TEXT
ALTER TABLE "patients" ALTER COLUMN "short_history" TYPE TEXT;
ALTER TABLE "patients" ALTER COLUMN "surgical_history" TYPE TEXT;
ALTER TABLE "patients" ALTER COLUMN "family_history" TYPE TEXT;
ALTER TABLE "patients" ALTER COLUMN "past_illness" TYPE TEXT;
ALTER TABLE "patients" ALTER COLUMN "address_details" TYPE TEXT;
ALTER TABLE "patients" ALTER COLUMN "special_notes" TYPE TEXT;
ALTER TABLE "patients" ALTER COLUMN "final_diagnosis" TYPE TEXT;

-- Step 5: Make columns required (NOT NULL)
ALTER TABLE "patients" ALTER COLUMN "date_of_birth" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "ethnicity" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "religion" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "patient_mobile" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "first_degree_relative_mobile" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "district" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "short_history" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "surgical_history" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "family_history" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "past_illness" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "special_notes" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "final_diagnosis" SET NOT NULL;

-- Step 6: Drop old columns (only if they exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='patients' AND column_name='relative_mobile') THEN
        ALTER TABLE "patients" DROP COLUMN "relative_mobile";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='patients' AND column_name='address') THEN
        ALTER TABLE "patients" DROP COLUMN "address";
    END IF;
END $$;

