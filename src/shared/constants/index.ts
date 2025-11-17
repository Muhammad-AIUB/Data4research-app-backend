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
  
  // Dropdown options for patient forms
  export const ETHNICITY_OPTIONS = [
    'Caucasian',
    'African',
    'South Asian',
    'East Asian',
    'Southeast Asian',
    'Middle Eastern / Arab',
    'Native American',
    'Pacific Islander / Polynesian / Micronesian',
    'Hispanic / Latino',
    'Aboriginal / Indigenous Australian',
    'Jewish (Ashkenazi, Sephardic, Mizrahi)',
    'Mediterranean',
    'Scandinavian / Northern European',
    'Black Caribbean',
    'Mixed Ethnicity (Multiracial)',
    'Other'
  ] as const;

  // Ethnicity with subgroups/examples
  export const ETHNICITY_WITH_SUBGROUPS = {
    'Caucasian': ['Northern European', 'Southern European', 'Eastern European'],
    'African': ['West African', 'East African', 'Afro-Caribbean'],
    'South Asian': ['Indian', 'Pakistani', 'Bangladeshi', 'Sri Lankan'],
    'East Asian': ['Chinese', 'Japanese', 'Korean'],
    'Southeast Asian': ['Thai', 'Burmese', 'Filipino', 'Malay', 'Indonesian'],
    'Middle Eastern / Arab': ['Arabian Peninsula', 'Levant', 'North African'],
    'Native American': ['North American', 'Central American', 'South American'],
    'Pacific Islander / Polynesian / Micronesian': ['Samoan', 'Tongan', 'Hawaiian'],
    'Hispanic / Latino': ['Mexican', 'Central American', 'South American'],
    'Aboriginal / Indigenous Australian': ['Various tribes'],
    'Jewish (Ashkenazi, Sephardic, Mizrahi)': ['Ashkenazi', 'Sephardic', 'Mizrahi'],
    'Mediterranean': ['Italian', 'Greek', 'Turkish', 'Cypriot'],
    'Scandinavian / Northern European': ['Swedish', 'Finnish', 'Norwegian'],
    'Black Caribbean': ['Jamaican', 'Trinidadian'],
    'Mixed Ethnicity (Multiracial)': [],
    'Other': []
  } as const;
  
  export const RELIGION_OPTIONS = [
    'Islam',
    'Hinduism',
    'Buddhism',
    'Christianity'
  ] as const;
  
  export const RELIGION_DEFAULT = 'Islam' as const;
  
  // All 64 districts of Bangladesh
  export const DISTRICT_OPTIONS = [
    'Dhaka',
    'Faridpur',
    'Gazipur',
    'Gopalganj',
    'Kishoreganj',
    'Madaripur',
    'Manikganj',
    'Munshiganj',
    'Narayanganj',
    'Narsingdi',
    'Rajbari',
    'Shariatpur',
    'Tangail',
    'Chittagong',
    'Bandarban',
    'Brahmanbaria',
    'Chandpur',
    'Comilla',
    'Cox\'s Bazar',
    'Feni',
    'Khagrachhari',
    'Lakshmipur',
    'Noakhali',
    'Rangamati',
    'Sylhet',
    'Habiganj',
    'Moulvibazar',
    'Sunamganj',
    'Barisal',
    'Barguna',
    'Bhola',
    'Jhalokati',
    'Patuakhali',
    'Pirojpur',
    'Khulna',
    'Bagerhat',
    'Chuadanga',
    'Jashore',
    'Jhenaidah',
    'Kushtia',
    'Magura',
    'Meherpur',
    'Narail',
    'Satkhira',
    'Rajshahi',
    'Bogura',
    'Chapainawabganj',
    'Joypurhat',
    'Naogaon',
    'Natore',
    'Pabna',
    'Sirajganj',
    'Rangpur',
    'Dinajpur',
    'Gaibandha',
    'Kurigram',
    'Lalmonirhat',
    'Nilphamari',
    'Panchagarh',
    'Thakurgaon',
    'Mymensingh',
    'Jamalpur',
    'Netrokona',
    'Sherpur'
  ] as const;
  
  // Common test names for investigations
  export const HEMATOLOGY_TEST_NAMES = [
    'Hemoglobin (Hb)',
    'Total WBC Count',
    'RBC Count',
    'Platelet Count',
    'Hematocrit (HCT)',
    'MCV',
    'MCH',
    'MCHC',
    'Neutrophils',
    'Lymphocytes',
    'Monocytes',
    'Eosinophils',
    'Basophils',
    'ESR',
    'Other'
  ] as const;
  
  export const LFT_TEST_NAMES = [
    'ALT (SGPT)',
    'AST (SGOT)',
    'ALP',
    'Total Bilirubin',
    'Direct Bilirubin',
    'Indirect Bilirubin',
    'Total Protein',
    'Albumin',
    'Globulin',
    'A/G Ratio',
    'GGT',
    'PT',
    'INR',
    'Other'
  ] as const;
  
  export const RFT_TEST_NAMES = [
    'Serum Creatinine',
    'Blood Urea',
    'Uric Acid',
    'Serum Sodium',
    'Serum Potassium',
    'Serum Chloride',
    'eGFR',
    'BUN',
    'Other'
  ] as const;
  
  export const TEST_METHODS = [
    'Automated',
    'Manual',
    'ELISA',
    'Chemiluminescence',
    'Colorimetric',
    'Other'
  ] as const;
  
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