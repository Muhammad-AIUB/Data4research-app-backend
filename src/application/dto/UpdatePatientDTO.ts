export interface UpdatePatientDTO {
    name?: string;
    age?: number;
    sex?: 'Male' | 'Female' | 'Other';
    patientMobile?: string;
    ethnicity?: string;
    religion?: string;
    nidNumber?: string;
    spouseMobile?: string;
    relativeMobile?: string;
    address?: string;
    district?: string;
    shortHistory?: string;
    surgicalHistory?: string;
    familyHistory?: string;
    pastIllness?: string;
    tags?: string[];
    specialNotes?: string;
    finalDiagnosis?: string;
  }