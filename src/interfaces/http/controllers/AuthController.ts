import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase, LoginUseCase } from '@/application/use-cases';
import { HTTP_STATUS } from '@/shared/constants';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.registerUseCase.execute(req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: { user: user.toJSON(), token }
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.loginUseCase.execute(req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { user: user.toJSON(), token }
      });
    } catch (error) {
      next(error);
    }
  };
}