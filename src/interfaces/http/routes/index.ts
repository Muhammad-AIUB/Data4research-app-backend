import { Router } from 'express';
import { createPatientRoutes } from './patient.routes';
import { createAuthRoutes } from './auth.routes';
import { createInvestigationRoutes } from './investigation.routes';
import { createExportRoutes } from './export.routes';
import { PatientController, AuthController, InvestigationController, ExportController } from '../controllers';
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
  ExportInvestigationUseCase
} from '@/application/use-cases';
import { 
  PrismaPatientRepository, 
  PrismaUserRepository,
  PrismaInvestigationRepository
} from '@/infrastructure/database';
import { JWTService, PasswordService } from '@/infrastructure/auth';
import { ExcelService } from '@/infrastructure/excel';

export const createRoutes = () => {
  const router = Router();

  const patientRepository = new PrismaPatientRepository();
  const userRepository = new PrismaUserRepository();
  const investigationRepository = new PrismaInvestigationRepository();
  const jwtService = new JWTService();
  const passwordService = new PasswordService();
  const excelService = new ExcelService();

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

  router.use('/auth', createAuthRoutes(authController));
  router.use('/patients', createPatientRoutes(patientController));
  router.use('/investigations', createInvestigationRoutes(investigationController));
  router.use('/export', createExportRoutes(exportController));

  return router;
};