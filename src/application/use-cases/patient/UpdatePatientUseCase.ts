import { Patient } from '@/domain/entities/Patient';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { UpdatePatientDTO } from '@/application/dto/UpdatePatientDTO';
import { NotFoundError, ValidationError } from '@/shared/errors';
import { logger } from '@/shared/utils';
import { getCacheService } from '@/infrastructure/cache';

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
    if (dto.sex !== undefined) existingPatient.sex = dto.sex;
    if (dto.patientMobile !== undefined) existingPatient.patientMobile = dto.patientMobile;
    if (dto.ethnicity !== undefined) existingPatient.ethnicity = dto.ethnicity;
    if (dto.religion !== undefined) existingPatient.religion = dto.religion;
    if (dto.nidNumber !== undefined) existingPatient.nidNumber = dto.nidNumber;
    if (dto.spouseMobile !== undefined) existingPatient.spouseMobile = dto.spouseMobile;
    if (dto.firstDegreeRelativeMobile !== undefined) existingPatient.firstDegreeRelativeMobile = dto.firstDegreeRelativeMobile;
    if (dto.district !== undefined) existingPatient.district = dto.district;
    if (dto.addressDetails !== undefined) existingPatient.addressDetails = dto.addressDetails;
    if (dto.shortHistory !== undefined) existingPatient.shortHistory = dto.shortHistory;
    if (dto.surgicalHistory !== undefined) existingPatient.surgicalHistory = dto.surgicalHistory;
    if (dto.familyHistory !== undefined) existingPatient.familyHistory = dto.familyHistory;
    if (dto.pastIllness !== undefined) existingPatient.pastIllness = dto.pastIllness;
    if (dto.tags !== undefined) existingPatient.tags = dto.tags;
    if (dto.specialNotes !== undefined) existingPatient.specialNotes = dto.specialNotes;
    if (dto.finalDiagnosis !== undefined) existingPatient.finalDiagnosis = dto.finalDiagnosis;

    // Handle dateOfBirth and age update
    if (dto.dateOfBirth !== undefined) {
      existingPatient.dateOfBirth = new Date(dto.dateOfBirth);
      // Recalculate age if dateOfBirth is updated
      const calculatedAge = calculateAge(dto.dateOfBirth);
      existingPatient.age = dto.age && Math.abs(dto.age - calculatedAge) <= 1 ? dto.age : calculatedAge;
    } else if (dto.age !== undefined) {
      existingPatient.age = dto.age;
    }

    existingPatient.updatedAt = new Date();

    const updatedPatient = await this.patientRepository.update(id, existingPatient, userId);

    // Invalidate patient list cache and individual patient cache
    const cache = getCacheService();
    await cache.deletePattern(`patients:list:${userId}:*`);
    await cache.delete(`patient:${id}:${userId}`);

    logger.info('Patient updated successfully', { patientId: id, userId });

    return updatedPatient;
  }
}