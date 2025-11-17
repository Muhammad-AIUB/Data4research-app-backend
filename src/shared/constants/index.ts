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

  export const CLINICAL_SECTIONS = ['ON_EXAMINATION', 'HEMATOLOGY', 'LFT', 'RFT'] as const;
  export type ClinicalSection = typeof CLINICAL_SECTIONS[number];

  export const CLINICAL_DROPDOWNS = {
    ON_EXAMINATION: {
      anaemia: ['Absent', 'Present', 'Mild', 'Moderate', 'Severe'],
      jaundice: ['Absent', 'Present', 'Mild', 'Moderate', 'Severe'],
      oedema: ['Absent', 'Present', '+', '++', '+++'],
      ascites: ['Absent', 'Mild', 'Moderate', 'Severe'],
      hepaticEncephalopathy: ['No encephalopathy', 'Grade I', 'Grade II', 'Grade III', 'Grade IV'],
      auscultationHeart: ['Normal', 'Abnormal'],
      auscultationLung: ['Normal', 'Abnormal'],
      dialysis: ['Yes', 'No']
    },
    HEMATOLOGY: {
      qualitative: ['Positive', 'Negative', 'Reactive', 'Non-reactive'],
      method: ['Automated', 'Manual', 'ELISA', 'CLIA', 'Chemiluminescence', 'Colorimetric', 'Other']
    },
    LFT: {
      qualitative: ['Positive', 'Negative'],
      hbsAg: ['Positive', 'Negative'],
      antiHbe: ['Positive', 'Negative'],
      hbeAg: ['Positive', 'Negative'],
      antiHbcIgm: ['Positive', 'Negative'],
      antiHbcTotal: ['Positive', 'Negative'],
      antiHcv: ['Positive', 'Negative'],
      antiHavIgm: ['Positive', 'Negative'],
      antiHevIgm: ['Positive', 'Negative'],
      ascites: ['Absent', 'Mild', 'Moderate', 'Marked'],
      hepaticEncephalopathy: ['No encephalopathy', 'Grade I', 'Grade II', 'Grade III', 'Grade IV'],
      isPatientGettingDialysis: ['Yes', 'No'],
      childPughClass: ['A', 'B', 'C'],
      method: ['Automated', 'Manual', 'Other']
    },
    RFT: {
      creatinineUnit: ['mg/dL', 'µmol/L'],
      electrolytesUnit: ['mmol/L', 'mEq/L']
    }
  } as const;

  export const ON_EXAMINATION_FIELDS = [
    { key: 'heightCm', label: 'Height', unit: 'cm' },
    { key: 'heightFeet', label: 'Height', unit: 'feet' },
    { key: 'heightInch', label: 'Height', unit: 'inch' },
    { key: 'weightKg', label: 'Weight', unit: 'kg' },
    { key: 'weightLb', label: 'Weight', unit: 'lb' },
    { key: 'systolic', label: 'Systolic BP', unit: 'mmHg' },
    { key: 'diastolic', label: 'Diastolic BP', unit: 'mmHg' },
    { key: 'meanArterialPressure', label: 'Mean Arterial Pressure', unit: 'mmHg' },
    { key: 'pulse', label: 'Pulse', unit: 'bpm' },
    { key: 'respiratoryRate', label: 'Respiratory Rate', unit: '/min' },
    { key: 'spo2', label: 'Oxygen Saturation', unit: '%' },
    { key: 'bmi', label: 'BMI', unit: 'kg/m²' },
    { key: 'idealBodyWeightKg', label: 'Ideal Body Weight', unit: 'kg' }
  ] as const;

  export const HEMATOLOGY_FIELDS = [
    { key: 'rbc', label: 'RBC', unit: 'million/µL' },
    { key: 'hb', label: 'Hb / Hgb', unit: 'g/dL' },
    { key: 'hct', label: 'HCT', unit: '%' },
    { key: 'mcv', label: 'MCV', unit: 'fL' },
    { key: 'mch', label: 'MCH', unit: 'pg' },
    { key: 'mchc', label: 'MCHC', unit: 'g/dL' },
    { key: 'rdw', label: 'RDW', unit: '%' },
    { key: 'wbc', label: 'WBC', unit: 'cells/µL' },
    { key: 'neutrophils', label: 'Neutrophils', unit: '%' },
    { key: 'lymphocytes', label: 'Lymphocytes', unit: '%' },
    { key: 'monocytes', label: 'Monocytes', unit: '%' },
    { key: 'eosinophils', label: 'Eosinophils', unit: '%' },
    { key: 'basophils', label: 'Basophils', unit: '%' },
    { key: 'plateletCount', label: 'Platelet Count', unit: '×10³/µL' },
    { key: 'esr', label: 'ESR', unit: 'mm/hr' },
    { key: 'prothrombinTime', label: 'Prothrombin Time', unit: 'sec' },
    { key: 'aptt', label: 'APTT', unit: 'sec' },
    { key: 'dDimer', label: 'D-dimer', unit: 'µg/mL' },
    { key: 'bleedingTime', label: 'Bleeding Time', unit: 'sec' },
    { key: 'clottingTime', label: 'Clotting Time', unit: 'sec' },
    { key: 'serumIron', label: 'Serum Iron', unit: 'µg/dL' },
    { key: 'tibc', label: 'TIBC', unit: 'µg/dL' },
    { key: 'ferritin', label: 'Serum Ferritin', unit: 'ng/mL' },
    { key: 'tsat', label: 'TSAT', unit: '%' },
    { key: 'vitaminB12', label: 'S. B12 Level', unit: 'pg/mL' },
    { key: 'folate', label: 'S. Folate', unit: 'ng/mL' }
  ] as const;

  export const LFT_FIELDS = [
    { key: 'alt', label: 'ALT / SGPT', unit: 'U/L' },
    { key: 'ast', label: 'AST / SGOT', unit: 'U/L' },
    { key: 'alp', label: 'ALP', unit: 'U/L' },
    { key: 'bilirubinTotal', label: 'Bilirubin (Total)', unit: 'mg/dL' },
    { key: 'bilirubinDirect', label: 'Bilirubin (Direct)', unit: 'mg/dL' },
    { key: 'bilirubinIndirect', label: 'Bilirubin (Indirect)', unit: 'mg/dL' },
    { key: 'prothrombinTime', label: 'Prothrombin Time', unit: 'sec' },
    { key: 'inr', label: 'INR', unit: '' },
    { key: 'albumin', label: 'S. Albumin', unit: 'g/dL' },
    { key: 'globulin', label: 'S. Globulin', unit: 'g/dL' },
    { key: 'agRatio', label: 'A/G Ratio', unit: '' },
    { key: 'totalProtein', label: 'S. Total Protein', unit: 'g/dL' },
    { key: 'hbsAg', label: 'HBsAg', unit: 'Result' },
    { key: 'antiHbe', label: 'Anti HBe', unit: 'Result' },
    { key: 'hbeAg', label: 'HBeAg', unit: 'Result' },
    { key: 'antiHbcIgm', label: 'Anti HBc IgM', unit: 'Result' },
    { key: 'antiHbcTotal', label: 'Anti HBc Total', unit: 'Result' },
    { key: 'hbvDna', label: 'HBV DNA', unit: 'IU/mL' },
    { key: 'antiHcv', label: 'Anti HCV', unit: 'Result' },
    { key: 'hcvRna', label: 'HCV RNA', unit: 'IU/mL' },
    { key: 'antiHavIgm', label: 'Anti HAV IgM', unit: 'Result' },
    { key: 'antiHevIgm', label: 'Anti HEV IgM', unit: 'Result' },
    { key: 'meldScore', label: 'MELD Score', unit: '' },
    { key: 'meldNaScore', label: 'MELD-Na Score', unit: '' }
  ] as const;

  export const RFT_FIELDS = [
    { key: 'creatinine', label: 'S. Creatinine (mg/dL)', unit: 'mg/dL' },
    { key: 'creatinineUmol', label: 'S. Creatinine (µmol/L)', unit: 'µmol/L' },
    { key: 'sodium', label: 'Sodium (Na+)', unit: 'mmol/L' },
    { key: 'potassium', label: 'Potassium (K+)', unit: 'mmol/L' },
    { key: 'chloride', label: 'Chloride (Cl-)', unit: 'mmol/L' },
    { key: 'bicarbonate', label: 'Bicarbonate (HCO3-)', unit: 'mmol/L' },
    { key: 'bun', label: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL' }
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