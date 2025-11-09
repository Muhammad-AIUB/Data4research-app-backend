import { z } from 'zod';
import { REGEX, SEX_OPTIONS } from '@/shared/constants';

export const CreatePatientSchema = z.object({
  patientId: z.string().regex(REGEX.PATIENT_ID, 'Patient ID must be in format P000001'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().int().min(0).max(150),
  sex: z.enum(['Male', 'Female', 'Other']),
  patientMobile: z.string().regex(REGEX.MOBILE_BD, 'Invalid mobile number').optional(),
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  nidNumber: z.string().optional(),
  spouseMobile: z.string().regex(REGEX.MOBILE_BD, 'Invalid mobile number').optional(),
  relativeMobile: z.string().regex(REGEX.MOBILE_BD, 'Invalid mobile number').optional(),
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

export const UpdatePatientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  age: z.number().int().min(0).max(150).optional(),
  sex: z.enum(['Male', 'Female', 'Other']).optional(),
  patientMobile: z.string().regex(REGEX.MOBILE_BD, 'Invalid mobile number').optional(),
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  nidNumber: z.string().optional(),
  spouseMobile: z.string().regex(REGEX.MOBILE_BD, 'Invalid mobile number').optional(),
  relativeMobile: z.string().regex(REGEX.MOBILE_BD, 'Invalid mobile number').optional(),
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

export const RegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});
