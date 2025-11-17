export interface UpdatePatientDTO {
    name?: string;
    dateOfBirth?: string; // ISO date string (YYYY-MM-DD)
    age?: number; // Will be recalculated if dateOfBirth is updated
    sex?: 'Male' | 'Female' | 'Other';
    ethnicity?: string;
    religion?: string;
    nidNumber?: string;
    patientMobile?: string;
    spouseMobile?: string;
    firstDegreeRelativeMobile?: string;
    district?: string;
    addressDetails?: string;
    shortHistory?: string;
    surgicalHistory?: string;
    familyHistory?: string;
    pastIllness?: string;
    tags?: string[];
    specialNotes?: string;
    finalDiagnosis?: string;
  }