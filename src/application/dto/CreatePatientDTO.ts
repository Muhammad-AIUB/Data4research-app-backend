export interface CreatePatientDTO {
  patientId: string;
  name: string;
  dateOfBirth: string; // ISO date string (YYYY-MM-DD)
  sex: 'Male' | 'Female' | 'Other';
  ethnicity: string;
  religion?: string; // Optional in DTO, will default to 'Islam' if not provided
  nidNumber?: string;
  patientMobile: string;
  spouseMobile?: string;
  firstDegreeRelativeMobile: string;
  district: string;
  addressDetails?: string; // Optional: house no, road no, village etc
  shortHistory: string;
  surgicalHistory: string;
  familyHistory: string;
  pastIllness: string;
  tags: string[];
  specialNotes: string;
  finalDiagnosis: string;
}