import { Patient } from '@/domain/entities/Patient';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { CreatePatientDTO } from '@/application/dto/CreatePatientDTO';
import { ValidationError } from '@/shared/errors';
import { v4 as uuid } from 'uuid';
import { logger } from '@/shared/utils';

export class CreatePatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(dto: CreatePatientDTO, userId: string): Promise<Patient> {
    logger.info('Creating patient', { userId, patientName: dto.name });

    const existingById = await this.patientRepository.findByPatientId(dto.patientId, userId);
    if (existingById) {
      throw new ValidationError(`Patient ID ${dto.patientId} already exists`);
    }

    if (dto.patientMobile) {
      const existingByMobile = await this.patientRepository.findByMobile(dto.patientMobile, userId);
      if (existingByMobile) {
        throw new ValidationError(`Patient with mobile ${dto.patientMobile} already exists`);
      }
    }

    const patient = Patient.create({
      id: uuid(),
      userId: userId,
      patientId: dto.patientId,
      name: dto.name,
      age: dto.age,
      sex: dto.sex,
      patientMobile: dto.patientMobile,
      ethnicity: dto.ethnicity,
      religion: dto.religion,
      nidNumber: dto.nidNumber,
      spouseMobile: dto.spouseMobile,
      relativeMobile: dto.relativeMobile,
      address: dto.address,
      district: dto.district,
      shortHistory: dto.shortHistory,
      surgicalHistory: dto.surgicalHistory,
      familyHistory: dto.familyHistory,
      pastIllness: dto.pastIllness,
      tags: dto.tags,
      specialNotes: dto.specialNotes,
      finalDiagnosis: dto.finalDiagnosis
    });

    const savedPatient = await this.patientRepository.save(patient, userId);

    logger.info('Patient created successfully', { patientId: savedPatient.id, userId });

    return savedPatient;
  }
}