// Error classes

export class AppError extends Error {
    constructor(
      public message: string,
      public statusCode: number = 500,
      public isOperational: boolean = true
    ) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string) {
      super(message, 400, true);
      this.name = 'ValidationError';
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
      super(message, 404, true);
      this.name = 'NotFoundError';
    }
  }
  
  export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
      super(message, 401, true);
      this.name = 'UnauthorizedError';
    }
  }