import { Prisma } from '@prisma/client';
import { PatientClinicalEntry, ClinicalSectionType } from '@/domain/entities';
import {
  CreateClinicalEntryDTO,
  IPatientClinicalRepository,
  UpdateClinicalEntryDTO
} from '@/domain/interfaces';
import { prisma } from '@/infrastructure/database/prisma/client';
import { v4 as uuid } from 'uuid';

type TableMap = {
  [key in ClinicalSectionType]: {
    delegate: any;
    section: ClinicalSectionType;
  };
};

const SECTION_TABLES: TableMap = {
  ON_EXAMINATION: { delegate: prisma.patientExamination, section: 'ON_EXAMINATION' },
  HEMATOLOGY: { delegate: prisma.patientHematologyPanel, section: 'HEMATOLOGY' },
  LFT: { delegate: prisma.patientLftPanel, section: 'LFT' },
  RFT: { delegate: prisma.patientRftPanel, section: 'RFT' }
};

export class PrismaPatientClinicalRepository implements IPatientClinicalRepository {
  private getDelegate(section: ClinicalSectionType) {
    const tableConfig = SECTION_TABLES[section];
    if (!tableConfig) {
      throw new Error(`Invalid section: ${section}. Valid sections are: ${Object.keys(SECTION_TABLES).join(', ')}`);
    }
    return tableConfig.delegate;
  }

  private toDomain(section: ClinicalSectionType, record: any): PatientClinicalEntry {
    return PatientClinicalEntry.create({
      id: record.id,
      patientId: record.patientId || record.patient_id,
      section,
      recordedAt: record.recordedAt || record.recorded_at,
      values: record.values ?? {},
      meta: record.meta ?? undefined,
      createdAt: record.createdAt || record.created_at,
      updatedAt: record.updatedAt || record.updated_at
    });
  }

  async create(entry: CreateClinicalEntryDTO): Promise<PatientClinicalEntry> {
    const delegate = this.getDelegate(entry.section);
    const id = uuid();
    const created = await delegate.create({
      data: {
        id,
        patientId: entry.patientId,
        recordedAt: entry.recordedAt,
        values: entry.values as Prisma.JsonValue,
        meta: (entry.meta ?? {}) as Prisma.JsonValue
      }
    });
    return this.toDomain(entry.section, created);
  }

  async update(
    entryId: string,
    section: ClinicalSectionType,
    data: UpdateClinicalEntryDTO
  ): Promise<PatientClinicalEntry> {
    const delegate = this.getDelegate(section);
    const updated = await delegate.update({
      where: { id: entryId },
      data: {
        recordedAt: data.recordedAt,
        values: data.values as Prisma.JsonValue | undefined,
        meta: data.meta as Prisma.JsonValue | undefined,
        updatedAt: new Date()
      }
    });
    return this.toDomain(section, updated);
  }

  async delete(entryId: string, section: ClinicalSectionType): Promise<void> {
    const delegate = this.getDelegate(section);
    await delegate.delete({ where: { id: entryId } });
  }

  async findById(entryId: string, section: ClinicalSectionType): Promise<PatientClinicalEntry | null> {
    const delegate = this.getDelegate(section);
    const record = await delegate.findUnique({ where: { id: entryId } });
    if (!record) return null;
    return this.toDomain(section, record);
  }

  async list(patientId: string, section: ClinicalSectionType): Promise<PatientClinicalEntry[]> {
    const delegate = this.getDelegate(section);
    const records = await delegate.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' }
    });
    return records.map((record: any) => this.toDomain(section, record));
  }
}

