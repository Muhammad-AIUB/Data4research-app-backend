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

export const RegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const LoginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const TestResultSchema = z.object({
  testName: z.string().min(1, 'Test name is required'),
  value: z.string().min(1, 'Test value is required'),
  unit: z.string().optional(),
  isFavourite: z.boolean().optional(),
  notes: z.string().optional()
});

const LFTTestResultSchema = TestResultSchema.extend({
  testMethod: z.string().optional()
});

export const CreateInvestigationSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  investigationDate: z.string().min(1, 'Investigation date is required'),
  hematology: z.array(TestResultSchema).optional(),
  lft: z.array(LFTTestResultSchema).optional(),
  rft: z.array(TestResultSchema).optional()
});