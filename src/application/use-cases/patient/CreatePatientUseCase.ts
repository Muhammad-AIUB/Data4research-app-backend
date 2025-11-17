import { Patient } from '@/domain/entities/Patient';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { CreatePatientDTO } from '@/application/dto/CreatePatientDTO';
import { ValidationError } from '@/shared/errors';
import { RELIGION_DEFAULT } from '@/shared/constants';
import { v4 as uuid } from 'uuid';
import { logger } from '@/shared/utils';

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export class CreatePatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(dto: CreatePatientDTO, userId: string): Promise<Patient> {
    logger.info('Creating patient', { userId, patientName: dto.name });

    const existingById = await this.patientRepository.findByPatientId(dto.patientId, userId);
    if (existingById) {
      throw new ValidationError(`Patient ID ${dto.patientId} already exists`);
    }

    const existingByMobile = await this.patientRepository.findByMobile(dto.patientMobile, userId);
    if (existingByMobile) {
      throw new ValidationError(`Patient with mobile ${dto.patientMobile} already exists`);
    }

    // Calculate age from dateOfBirth if not provided or doesn't match
    const calculatedAge = calculateAge(dto.dateOfBirth);
    const age = dto.age && Math.abs(dto.age - calculatedAge) <= 1 ? dto.age : calculatedAge;

    // Set default religion to Islam if not provided
    const religion = dto.religion || RELIGION_DEFAULT;

    const patient = Patient.create({
      id: uuid(),
      userId: userId,
      patientId: dto.patientId,
      name: dto.name,
      dateOfBirth: dto.dateOfBirth,
      age: age,
      sex: dto.sex,
      ethnicity: dto.ethnicity,
      religion: religion,
      patientMobile: dto.patientMobile,
      firstDegreeRelativeMobile: dto.firstDegreeRelativeMobile,
      district: dto.district,
      shortHistory: dto.shortHistory,
      surgicalHistory: dto.surgicalHistory,
      familyHistory: dto.familyHistory,
      pastIllness: dto.pastIllness,
      tags: dto.tags,
      specialNotes: dto.specialNotes,
      finalDiagnosis: dto.finalDiagnosis,
      nidNumber: dto.nidNumber,
      spouseMobile: dto.spouseMobile,
      addressDetails: dto.addressDetails
    });

    const savedPatient = await this.patientRepository.save(patient, userId);

    logger.info('Patient created successfully', { patientId: savedPatient.id, userId });

    return savedPatient;
  }
}