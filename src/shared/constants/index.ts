// Fixed values

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
  } as const;
  
  export const SEX_OPTIONS = ['Male', 'Female', 'Other'] as const;
  export type Sex = typeof SEX_OPTIONS[number];
  
  export const REGEX = {
    MOBILE_BD: /^01[3-9]\d{8}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PATIENT_ID: /^P\d{6}$/,
    LETTERS_ONLY: /^[A-Za-z\s.]+$/,
    NUMBERS_ONLY: /^\d+$/,
    ALPHANUMERIC: /^[A-Za-z0-9]+$/
  } as const;
  
  export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1
  } as const;
  
  export const ERROR_MESSAGES = {
    REQUIRED_FIELD: (field: string) => `${field} is required`,
    INVALID_FORMAT: (field: string) => `${field} format is invalid`,
    MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
    MAX_LENGTH: (field: string, max: number) => `${field} must not exceed ${max} characters`,
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Please login to continue',
    TOKEN_EXPIRED: 'Your session has expired. Please login again',
    INVALID_TOKEN: 'Invalid authentication token',
    NOT_FOUND: (resource: string) => `${resource} not found`,
    ALREADY_EXISTS: (resource: string) => `${resource} already exists`,
    CREATE_FAILED: (resource: string) => `Failed to create ${resource}`,
    UPDATE_FAILED: (resource: string) => `Failed to update ${resource}`,
    DELETE_FAILED: (resource: string) => `Failed to delete ${resource}`,
    INTERNAL_ERROR: 'Internal server error. Please try again later',
    DATABASE_ERROR: 'Database operation failed',
    NETWORK_ERROR: 'Network error. Please check your connection'
  } as const;
  
  export const SUCCESS_MESSAGES = {
    CREATED: (resource: string) => `${resource} created successfully`,
    UPDATED: (resource: string) => `${resource} updated successfully`,
    DELETED: (resource: string) => `${resource} deleted successfully`,
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful'
  } as const;