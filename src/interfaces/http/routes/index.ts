import { Router } from 'express';
import { createPatientRoutes } from './patient.routes';
import { createAuthRoutes } from './auth.routes';
import { PatientController, AuthController } from '../controllers';
import { 
  CreatePatientUseCase, 
  GetPatientUseCase, 
  ListPatientsUseCase, 
  SearchPatientsUseCase,
  UpdatePatientUseCase,
  DeletePatientUseCase,
  RegisterUseCase,
  LoginUseCase
} from '@/application/use-cases';
import { PrismaPatientRepository, PrismaUserRepository } from '@/infrastructure/database';
import { JWTService, PasswordService } from '@/infrastructure/auth';

export const createRoutes = () => {
  const router = Router();

  // Patient routes
  const patientRepository = new PrismaPatientRepository();
  const createPatientUseCase = new CreatePatientUseCase(patientRepository);
  const getPatientUseCase = new GetPatientUseCase(patientRepository);
  const listPatientsUseCase = new ListPatientsUseCase(patientRepository);
  const searchPatientsUseCase = new SearchPatientsUseCase(patientRepository);
  const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
  const deletePatientUseCase = new DeletePatientUseCase(patientRepository);
  const patientController = new PatientController(
    createPatientUseCase,
    getPatientUseCase,
    listPatientsUseCase,
    searchPatientsUseCase,
    updatePatientUseCase,
    deletePatientUseCase
  );

  // Auth routes
  const userRepository = new PrismaUserRepository();
  const jwtService = new JWTService();
  const passwordService = new PasswordService();
  const registerUseCase = new RegisterUseCase(userRepository, passwordService, jwtService);
  const loginUseCase = new LoginUseCase(userRepository, passwordService, jwtService);
  const authController = new AuthController(registerUseCase, loginUseCase);

  router.use('/auth', createAuthRoutes(authController));
  router.use('/patients', createPatientRoutes(patientController));

  return router;
};