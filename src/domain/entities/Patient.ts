import { ValidationError } from '@/shared/errors';
import { REGEX, SEX_OPTIONS, ETHNICITY_OPTIONS, RELIGION_OPTIONS, DISTRICT_OPTIONS, RELIGION_DEFAULT } from '@/shared/constants';

export type Sex = 'Male' | 'Female' | 'Other';

export class Patient {
  public readonly id: string;
  public readonly userId: string;
  public patientId: string;
  public name: string;
  public dateOfBirth: Date;
  public age: number;
  public sex: Sex;
  public ethnicity: string;
  public religion: string;
  public nidNumber?: string;
  public patientMobile: string;
  public spouseMobile?: string;
  public firstDegreeRelativeMobile: string;
  public district: string;
  public addressDetails?: string;
  public shortHistory: string;
  public surgicalHistory: string;
  public familyHistory: string;
  public pastIllness: string;
  public tags: string[];
  public specialNotes: string;
  public finalDiagnosis: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    patientId: string,
    name: string,
    dateOfBirth: Date,
    age: number,
    sex: Sex,
    ethnicity: string,
    religion: string,
    patientMobile: string,
    firstDegreeRelativeMobile: string,
    district: string,
    shortHistory: string,
    surgicalHistory: string,
    familyHistory: string,
    pastIllness: string,
    tags: string[],
    specialNotes: string,
    finalDiagnosis: string,
    nidNumber?: string,
    spouseMobile?: string,
    addressDetails?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.userId = userId;
    this.patientId = patientId;
    this.name = name;
    this.dateOfBirth = dateOfBirth;
    this.age = age;
    this.sex = sex;
    this.ethnicity = ethnicity;
    this.religion = religion;
    this.patientMobile = patientMobile;
    this.firstDegreeRelativeMobile = firstDegreeRelativeMobile;
    this.district = district;
    this.shortHistory = shortHistory;
    this.surgicalHistory = surgicalHistory;
    this.familyHistory = familyHistory;
    this.pastIllness = pastIllness;
    this.tags = tags;
    this.specialNotes = specialNotes;
    this.finalDiagnosis = finalDiagnosis;
    this.nidNumber = nidNumber;
    this.spouseMobile = spouseMobile;
    this.addressDetails = addressDetails;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long');
    }
    
    if (!this.dateOfBirth || !(this.dateOfBirth instanceof Date) || isNaN(this.dateOfBirth.getTime())) {
      throw new ValidationError('Date of birth must be a valid date');
    }
    
    if (isNaN(this.age) || this.age < 0 || this.age > 150) {
      throw new ValidationError('Age must be a valid number between 0 and 150');
    }
    
    if (!SEX_OPTIONS.includes(this.sex as any)) {
      throw new ValidationError(`Sex must be one of: ${SEX_OPTIONS.join(', ')}`);
    }
    
    if (!this.ethnicity || !ETHNICITY_OPTIONS.includes(this.ethnicity as any)) {
      throw new ValidationError(`Ethnicity must be one of: ${ETHNICITY_OPTIONS.join(', ')}`);
    }
    
    if (!this.religion || !RELIGION_OPTIONS.includes(this.religion as any)) {
      throw new ValidationError(`Religion must be one of: ${RELIGION_OPTIONS.join(', ')}`);
    }
    
    if (!this.patientMobile || !REGEX.MOBILE_BD.test(this.patientMobile)) {
      throw new ValidationError('Patient mobile number is required and must be a valid Bangladesh mobile number (01XXXXXXXXX)');
    }
    
    if (this.spouseMobile && !REGEX.MOBILE_BD.test(this.spouseMobile)) {
      throw new ValidationError('Spouse mobile number must be a valid Bangladesh mobile number');
    }
    
    if (!this.firstDegreeRelativeMobile || !REGEX.MOBILE_BD.test(this.firstDegreeRelativeMobile)) {
      throw new ValidationError('First degree relative mobile number is required and must be a valid Bangladesh mobile number');
    }
    
    if (!this.district || !DISTRICT_OPTIONS.includes(this.district as any)) {
      throw new ValidationError(`District must be one of: ${DISTRICT_OPTIONS.join(', ')}`);
    }
    
    if (!this.shortHistory || this.shortHistory.trim().length === 0) {
      throw new ValidationError('Short history is required');
    }
    
    if (!this.surgicalHistory || this.surgicalHistory.trim().length === 0) {
      throw new ValidationError('Surgical history is required');
    }
    
    if (!this.familyHistory || this.familyHistory.trim().length === 0) {
      throw new ValidationError('Family history is required');
    }
    
    if (!this.pastIllness || this.pastIllness.trim().length === 0) {
      throw new ValidationError('Past illness is required');
    }
    
    if (!this.tags || this.tags.length === 0) {
      throw new ValidationError('At least one tag is required');
    }
    
    if (!this.specialNotes || this.specialNotes.trim().length === 0) {
      throw new ValidationError('Special notes is required');
    }
    
    if (!this.finalDiagnosis || this.finalDiagnosis.trim().length === 0) {
      throw new ValidationError('Final diagnosis is required');
    }
    
    if (!REGEX.PATIENT_ID.test(this.patientId)) {
      throw new ValidationError('Patient ID must be in format P000001');
    }
  }

  public updateDiagnosis(diagnosis: string): void {
    if (!diagnosis || diagnosis.trim().length === 0) {
      throw new ValidationError('Diagnosis cannot be empty');
    }
    this.finalDiagnosis = diagnosis;
    this.updatedAt = new Date();
  }

  public addTag(tag: string): void {
    if (!tag || tag.trim().length === 0) {
      throw new ValidationError('Tag cannot be empty');
    }
    const normalizedTag = tag.trim().toLowerCase();
    const exists = this.tags.some(t => t.toLowerCase() === normalizedTag);
    if (!exists) {
      this.tags.push(tag.trim());
      this.updatedAt = new Date();
    }
  }

  public removeTag(tag: string): void {
    const normalizedTag = tag.trim().toLowerCase();
    this.tags = this.tags.filter(t => t.toLowerCase() !== normalizedTag);
    this.updatedAt = new Date();
  }

  public isAdult(): boolean {
    return this.age >= 18;
  }

  public isSeniorCitizen(): boolean {
    return this.age >= 60;
  }

  public isChild(): boolean {
    return this.age < 18;
  }

  public getAgeCategory(): string {
    if (this.age < 2) return 'Infant';
    if (this.age < 13) return 'Child';
    if (this.age < 18) return 'Adolescent';
    if (this.age < 60) return 'Adult';
    return 'Senior Citizen';
  }

  public hasContactNumber(): boolean {
    return !!(this.patientMobile || this.spouseMobile || this.firstDegreeRelativeMobile);
  }

  public getPrimaryContact(): string | undefined {
    return this.patientMobile || this.spouseMobile || this.firstDegreeRelativeMobile;
  }

  public toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      patientId: this.patientId,
      name: this.name,
      dateOfBirth: this.dateOfBirth.toISOString().split('T')[0],
      age: this.age,
      sex: this.sex,
      ethnicity: this.ethnicity,
      religion: this.religion,
      nidNumber: this.nidNumber,
      patientMobile: this.patientMobile,
      spouseMobile: this.spouseMobile,
      firstDegreeRelativeMobile: this.firstDegreeRelativeMobile,
      district: this.district,
      addressDetails: this.addressDetails,
      shortHistory: this.shortHistory,
      surgicalHistory: this.surgicalHistory,
      familyHistory: this.familyHistory,
      pastIllness: this.pastIllness,
      tags: this.tags,
      specialNotes: this.specialNotes,
      finalDiagnosis: this.finalDiagnosis,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isAdult: this.isAdult(),
      isSeniorCitizen: this.isSeniorCitizen(),
      isChild: this.isChild(),
      ageCategory: this.getAgeCategory(),
      primaryContact: this.getPrimaryContact()
    };
  }

  public static create(data: {
    id: string;
    userId: string;
    patientId: string;
    name: string;
    dateOfBirth: Date | string;
    age: number;
    sex: Sex;
    ethnicity: string;
    religion: string;
    patientMobile: string;
    firstDegreeRelativeMobile: string;
    district: string;
    shortHistory: string;
    surgicalHistory: string;
    familyHistory: string;
    pastIllness: string;
    tags: string[];
    specialNotes: string;
    finalDiagnosis: string;
    nidNumber?: string;
    spouseMobile?: string;
    addressDetails?: string;
  }): Patient {
    const dateOfBirth = typeof data.dateOfBirth === 'string' ? new Date(data.dateOfBirth) : data.dateOfBirth;
    return new Patient(
      data.id,
      data.userId,
      data.patientId,
      data.name,
      dateOfBirth,
      data.age,
      data.sex,
      data.ethnicity,
      data.religion,
      data.patientMobile,
      data.firstDegreeRelativeMobile,
      data.district,
      data.shortHistory,
      data.surgicalHistory,
      data.familyHistory,
      data.pastIllness,
      data.tags,
      data.specialNotes,
      data.finalDiagnosis,
      data.nidNumber,
      data.spouseMobile,
      data.addressDetails
    );
  }
}