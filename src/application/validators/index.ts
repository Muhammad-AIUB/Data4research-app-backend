// Input validation

import { z } from 'zod';
import { REGEX, SEX_OPTIONS } from '@/shared/constants';

export const CreatePatientSchema = z.object({
  patientId: z.string().regex(REGEX.PATIENT_ID, 'Patient ID must be in format P000001'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: z.number().int().min(0).max(150),
  sex: z.enum(SEX_OPTIONS),
  patientMobile: z.string().regex(REGEX.MOBILE_BD).optional(),
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  nidNumber: z.string().optional(),
  spouseMobile: z.string().regex(REGEX.MOBILE_BD).optional(),
  relativeMobile: z.string().regex(REGEX.MOBILE_BD).optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  shortHistory: z.string().optional(),
  surgicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  pastIllness: z.string().optional(),
  tags: z.array(z.string()).optional(),
  specialNotes: z.string().optional(),
  finalDiagnosis: z.string().optional()
});

export const UpdatePatientSchema = CreatePatientSchema.partial();

export const SearchPatientSchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters')
});