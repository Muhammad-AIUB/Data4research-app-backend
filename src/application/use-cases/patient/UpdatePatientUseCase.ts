import { Patient } from '@/domain/entities/Patient';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { UpdatePatientDTO } from '@/application/dto/UpdatePatientDTO';
import { NotFoundError, ValidationError } from '@/shared/errors';
import { logger } from '@/shared/utils';

export class UpdatePatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(id: string, dto: UpdatePatientDTO, userId: string): Promise<Patient> {
    logger.info('Updating patient', { patientId: id, userId });

    const existingPatient = await this.patientRepository.findById(id, userId);
    if (!existingPatient) {
      throw new NotFoundError(`Patient with ID ${id} not found`);
    }

    if (dto.patientMobile && dto.patientMobile !== existingPatient.patientMobile) {
      const existingByMobile = await this.patientRepository.findByMobile(dto.patientMobile, userId);
      if (existingByMobile && existingByMobile.id !== id) {
        throw new ValidationError(`Patient with mobile ${dto.patientMobile} already exists`);
      }
    }

    if (dto.name !== undefined) existingPatient.name = dto.name;
    if (dto.age !== undefined) existingPatient.age = dto.age;
    if (dto.sex !== undefined) existingPatient.sex = dto.sex;
    if (dto.patientMobile !== undefined) existingPatient.patientMobile = dto.patientMobile;
    if (dto.ethnicity !== undefined) existingPatient.ethnicity = dto.ethnicity;
    if (dto.religion !== undefined) existingPatient.religion = dto.religion;
    if (dto.nidNumber !== undefined) existingPatient.nidNumber = dto.nidNumber;
    if (dto.spouseMobile !== undefined) existingPatient.spouseMobile = dto.spouseMobile;
    if (dto.relativeMobile !== undefined) existingPatient.relativeMobile = dto.relativeMobile;
    if (dto.address !== undefined) existingPatient.address = dto.address;
    if (dto.district !== undefined) existingPatient.district = dto.district;
    if (dto.shortHistory !== undefined) existingPatient.shortHistory = dto.shortHistory;
    if (dto.surgicalHistory !== undefined) existingPatient.surgicalHistory = dto.surgicalHistory;
    if (dto.familyHistory !== undefined) existingPatient.familyHistory = dto.familyHistory;
    if (dto.pastIllness !== undefined) existingPatient.pastIllness = dto.pastIllness;
    if (dto.tags !== undefined) existingPatient.tags = dto.tags;
    if (dto.specialNotes !== undefined) existingPatient.specialNotes = dto.specialNotes;
    if (dto.finalDiagnosis !== undefined) existingPatient.finalDiagnosis = dto.finalDiagnosis;

    existingPatient.updatedAt = new Date();

    const updatedPatient = await this.patientRepository.update(id, existingPatient, userId);

    logger.info('Patient updated successfully', { patientId: id, userId });

    return updatedPatient;
  }
}