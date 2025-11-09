import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { Patient } from '@/domain/entities/Patient';
import { prisma } from '@/infrastructure/database/prisma/client';

export class PrismaPatientRepository implements IPatientRepository {
  
  async save(patient: Patient, userId: string): Promise<Patient> {
    const saved = await prisma.patient.create({
      data: {
        id: patient.id,
        userId: userId,
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        sex: patient.sex,
        ethnicity: patient.ethnicity,
        religion: patient.religion,
        nidNumber: patient.nidNumber,
        patientMobile: patient.patientMobile,
        spouseMobile: patient.spouseMobile,
        relativeMobile: patient.relativeMobile,
        address: patient.address,
        district: patient.district,
        shortHistory: patient.shortHistory,
        surgicalHistory: patient.surgicalHistory,
        familyHistory: patient.familyHistory,
        pastIllness: patient.pastIllness,
        tags: patient.tags,
        specialNotes: patient.specialNotes,
        finalDiagnosis: patient.finalDiagnosis,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt
      }
    });
    return this.toDomain(saved);
  }

  async findById(id: string, userId: string): Promise<Patient | null> {
    const patient = await prisma.patient.findFirst({
      where: { id, userId }
    });
    if (!patient) return null;
    return this.toDomain(patient);
  }

  async findByPatientId(patientId: string, userId: string): Promise<Patient | null> {
    const patient = await prisma.patient.findFirst({
      where: { patientId, userId }
    });
    if (!patient) return null;
    return this.toDomain(patient);
  }

  async findByMobile(mobile: string, userId: string): Promise<Patient | null> {
    const patient = await prisma.patient.findFirst({
      where: { patientMobile: mobile, userId }
    });
    if (!patient) return null;
    return this.toDomain(patient);
  }

  async findAll(userId: string, page: number = 1, limit: number = 10): Promise<{
    patients: Patient[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.patient.count({ where: { userId } })
    ]);
    return {
      patients: patients.map(p => this.toDomain(p)),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async search(query: string, userId: string): Promise<Patient[]> {
    const patients = await prisma.patient.findMany({
      where: {
        userId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { patientMobile: { contains: query } },
          { finalDiagnosis: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    return patients.map(p => this.toDomain(p));
  }

  async update(id: string, patient: Patient, userId: string): Promise<Patient> {
    const updated = await prisma.patient.update({
      where: { id },
      data: {
        name: patient.name,
        age: patient.age,
        sex: patient.sex,
        ethnicity: patient.ethnicity,
        religion: patient.religion,
        nidNumber: patient.nidNumber,
        patientMobile: patient.patientMobile,
        spouseMobile: patient.spouseMobile,
        relativeMobile: patient.relativeMobile,
        address: patient.address,
        district: patient.district,
        shortHistory: patient.shortHistory,
        surgicalHistory: patient.surgicalHistory,
        familyHistory: patient.familyHistory,
        pastIllness: patient.pastIllness,
        tags: patient.tags,
        specialNotes: patient.specialNotes,
        finalDiagnosis: patient.finalDiagnosis,
        updatedAt: new Date()
      }
    });
    return this.toDomain(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.patient.delete({ where: { id } });
  }

  async count(userId: string): Promise<number> {
    return await prisma.patient.count({ where: { userId } });
  }

  private toDomain(prismaPatient: any): Patient {
    return new Patient(
      prismaPatient.id,
      prismaPatient.userId,
      prismaPatient.patientId,
      prismaPatient.name,
      prismaPatient.age,
      prismaPatient.sex,
      prismaPatient.patientMobile,
      prismaPatient.ethnicity,
      prismaPatient.religion,
      prismaPatient.nidNumber,
      prismaPatient.spouseMobile,
      prismaPatient.relativeMobile,
      prismaPatient.address,
      prismaPatient.district,
      prismaPatient.shortHistory,
      prismaPatient.surgicalHistory,
      prismaPatient.familyHistory,
      prismaPatient.pastIllness,
      prismaPatient.tags,
      prismaPatient.specialNotes,
      prismaPatient.finalDiagnosis,
      prismaPatient.createdAt,
      prismaPatient.updatedAt
    );
  }
}
