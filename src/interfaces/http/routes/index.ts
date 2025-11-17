import { Router } from 'express';
import express from 'express';
import path from 'path';
import { createPatientRoutes } from './patient.routes';
import { createAuthRoutes } from './auth.routes';
import { createInvestigationRoutes } from './investigation.routes';
import { createExportRoutes } from './export.routes';
import { createImageRoutes } from './image.routes';
import { createDropdownRoutes } from './dropdown.routes';
import { createClinicalRoutes } from './clinical.routes';
import { 
  PatientController, 
  AuthController, 
  InvestigationController, 
  ExportController,
  ImageController,
  DropdownController,
  ClinicalDataController
} from '../controllers';
import { 
  CreatePatientUseCase, 
  GetPatientUseCase, 
  ListPatientsUseCase, 
  SearchPatientsUseCase,
  UpdatePatientUseCase,
  DeletePatientUseCase,
  RegisterUseCase,
  LoginUseCase,
  CreateInvestigationUseCase,
  GetInvestigationUseCase,
  ListInvestigationsUseCase,
  DeleteInvestigationUseCase,
  ExportPatientsUseCase,
  ExportPatientReportUseCase,
  ExportInvestigationUseCase,
  UploadPatientImageUseCase,
  UploadInvestigationImageUseCase,
  GetPatientImagesUseCase,
  GetInvestigationImagesUseCase,
  DeletePatientImageUseCase,
  CreateClinicalEntryUseCase,
  ListClinicalEntriesUseCase,
  UpdateClinicalEntryUseCase,
  DeleteClinicalEntryUseCase
} from '@/application/use-cases';
import { 
  PrismaPatientRepository, 
  PrismaUserRepository,
  PrismaInvestigationRepository,
  PrismaImageRepository,
  PrismaPatientClinicalRepository
} from '@/infrastructure/database';
import { JWTService, PasswordService } from '@/infrastructure/auth';
import { ExcelService } from '@/infrastructure/excel';
import { FileStorageService } from '@/infrastructure/storage';

export const createRoutes = () => {
  const router = Router();

  const patientRepository = new PrismaPatientRepository();
  const userRepository = new PrismaUserRepository();
  const investigationRepository = new PrismaInvestigationRepository();
  const imageRepository = new PrismaImageRepository();
  const clinicalRepository = new PrismaPatientClinicalRepository();
  const jwtService = new JWTService();
  const passwordService = new PasswordService();
  const excelService = new ExcelService();
  const fileStorageService = new FileStorageService();

  const createPatientUseCase = new CreatePatientUseCase(patientRepository);
  const getPatientUseCase = new GetPatientUseCase(patientRepository);
  const listPatientsUseCase = new ListPatientsUseCase(patientRepository);
  const searchPatientsUseCase = new SearchPatientsUseCase(patientRepository);
  const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
  const deletePatientUseCase = new DeletePatientUseCase(patientRepository);
  const patientController = new PatientController(
    createPatientUseCase, getPatientUseCase, listPatientsUseCase,
    searchPatientsUseCase, updatePatientUseCase, deletePatientUseCase
  );

  const createClinicalEntryUseCase = new CreateClinicalEntryUseCase(patientRepository, clinicalRepository);
  const listClinicalEntriesUseCase = new ListClinicalEntriesUseCase(patientRepository, clinicalRepository);
  const updateClinicalEntryUseCase = new UpdateClinicalEntryUseCase(patientRepository, clinicalRepository);
  const deleteClinicalEntryUseCase = new DeleteClinicalEntryUseCase(patientRepository, clinicalRepository);
  const clinicalController = new ClinicalDataController(
    createClinicalEntryUseCase,
    listClinicalEntriesUseCase,
    updateClinicalEntryUseCase,
    deleteClinicalEntryUseCase
  );

  const registerUseCase = new RegisterUseCase(userRepository, passwordService, jwtService);
  const loginUseCase = new LoginUseCase(userRepository, passwordService, jwtService);
  const authController = new AuthController(registerUseCase, loginUseCase);

  const createInvestigationUseCase = new CreateInvestigationUseCase(investigationRepository, patientRepository);
  const getInvestigationUseCase = new GetInvestigationUseCase(investigationRepository);
  const listInvestigationsUseCase = new ListInvestigationsUseCase(investigationRepository);
  const deleteInvestigationUseCase = new DeleteInvestigationUseCase(investigationRepository);
  const investigationController = new InvestigationController(
    createInvestigationUseCase, getInvestigationUseCase,
    listInvestigationsUseCase, deleteInvestigationUseCase
  );

  const exportPatientsUseCase = new ExportPatientsUseCase(patientRepository, excelService);
  const exportPatientReportUseCase = new ExportPatientReportUseCase(patientRepository, investigationRepository, excelService);
  const exportInvestigationUseCase = new ExportInvestigationUseCase(investigationRepository, excelService);
  const exportController = new ExportController(
    exportPatientsUseCase, exportPatientReportUseCase, exportInvestigationUseCase
  );

  const uploadPatientImageUseCase = new UploadPatientImageUseCase(imageRepository, patientRepository, fileStorageService);
  const uploadInvestigationImageUseCase = new UploadInvestigationImageUseCase(imageRepository, investigationRepository, fileStorageService);
  const getPatientImagesUseCase = new GetPatientImagesUseCase(imageRepository);
  const getInvestigationImagesUseCase = new GetInvestigationImagesUseCase(imageRepository);
  const deletePatientImageUseCase = new DeletePatientImageUseCase(imageRepository, fileStorageService);
  const imageController = new ImageController(
    uploadPatientImageUseCase,
    uploadInvestigationImageUseCase,
    getPatientImagesUseCase,
    getInvestigationImagesUseCase,
    deletePatientImageUseCase
  );

  const dropdownController = new DropdownController();

  router.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  router.use('/auth', createAuthRoutes(authController));
  router.use('/patients', createPatientRoutes(patientController));
  router.use('/patients', createClinicalRoutes(clinicalController));
  router.use('/investigations', createInvestigationRoutes(investigationController));
  router.use('/export', createExportRoutes(exportController));
  router.use('/images', createImageRoutes(imageController));
  router.use('/dropdown', createDropdownRoutes(dropdownController));

  return router;
};