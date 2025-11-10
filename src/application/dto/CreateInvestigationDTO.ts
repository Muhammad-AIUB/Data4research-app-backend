export interface CreateInvestigationDTO {
    patientId: string;
    investigationDate: string;
    hematology?: {
      testName: string;
      value: string;
      unit?: string;
      isFavourite?: boolean;
      notes?: string;
    }[];
    lft?: {
      testName: string;
      value: string;
      unit?: string;
      testMethod?: string;
      isFavourite?: boolean;
      notes?: string;
    }[];
    rft?: {
      testName: string;
      value: string;
      unit?: string;
      isFavourite?: boolean;
      notes?: string;
    }[];
  }