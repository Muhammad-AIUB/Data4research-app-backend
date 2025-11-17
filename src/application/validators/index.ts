import { z } from 'zod';
import { REGEX, SEX_OPTIONS, ETHNICITY_OPTIONS, RELIGION_OPTIONS, DISTRICT_OPTIONS } from '@/shared/constants';

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const CreatePatientBaseSchema = z.object({
  patientId: z.string().regex(REGEX.PATIENT_ID, 'Patient ID must be in format P000001'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in format YYYY-MM-DD'),
  age: z.number().int().min(0).max(150),
  sex: z.enum(SEX_OPTIONS),
  ethnicity: z.enum(ETHNICITY_OPTIONS, { errorMap: () => ({ message: 'Invalid ethnicity' }) }),
  religion: z.enum(RELIGION_OPTIONS, { errorMap: () => ({ message: 'Invalid religion' }) }).optional(),
  nidNumber: z.string().optional(),
  patientMobile: z.string().regex(REGEX.MOBILE_BD, 'Patient mobile must be a valid Bangladesh mobile number'),
  spouseMobile: z.string().regex(REGEX.MOBILE_BD, 'Spouse mobile must be a valid Bangladesh mobile number').optional(),
  firstDegreeRelativeMobile: z.string().regex(REGEX.MOBILE_BD, 'First degree relative mobile must be a valid Bangladesh mobile number'),
  district: z.enum(DISTRICT_OPTIONS, { errorMap: () => ({ message: 'Invalid district' }) }),
  addressDetails: z.string().optional(),
  shortHistory: z.string().min(1, 'Short history is required'),
  surgicalHistory: z.string().min(1, 'Surgical history is required'),
  familyHistory: z.string().min(1, 'Family history is required'),
  pastIllness: z.string().min(1, 'Past illness is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  specialNotes: z.string().min(1, 'Special notes is required'),
  finalDiagnosis: z.string().min(1, 'Final diagnosis is required')
});

export const CreatePatientSchema = CreatePatientBaseSchema.refine((data) => {
  // Validate that age matches dateOfBirth
  const calculatedAge = calculateAge(data.dateOfBirth);
  return Math.abs(calculatedAge - data.age) <= 1; // Allow 1 year difference for rounding
}, {
  message: 'Age does not match date of birth',
  path: ['age']
});

export const UpdatePatientSchema = CreatePatientBaseSchema.partial().refine((data) => {
  // Only validate age/dateOfBirth if both are provided
  if (data.dateOfBirth && data.age !== undefined) {
    const calculatedAge = calculateAge(data.dateOfBirth);
    return Math.abs(calculatedAge - data.age) <= 1;
  }
  return true;
}, {
  message: 'Age does not match date of birth',
  path: ['age']
});

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