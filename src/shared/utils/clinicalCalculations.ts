/**
 * Clinical Calculations Service
 * All medical formulas and unit conversions
 */

export class ClinicalCalculations {
  // ==================== HEIGHT CONVERSIONS ====================
  
  /**
   * Convert feet and inches to centimeters
   * Formula: (feet × 30.48) + (inch × 2.54)
   */
  static feetInchToCm(feet: number, inch: number): number {
    return (feet * 30.48) + (inch * 2.54);
  }

  /**
   * Convert centimeters to feet and inches
   */
  static cmToFeetInch(cm: number): { feet: number; inch: number } {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inch = Math.round(totalInches % 12);
    return { feet, inch };
  }

  // ==================== WEIGHT CONVERSIONS ====================
  
  /**
   * Convert pounds to kilograms
   * Formula: lb × 0.453592 = kg
   */
  static poundToKg(pound: number): number {
    return pound * 0.453592;
  }

  /**
   * Convert kilograms to pounds
   * Formula: kg ÷ 0.453592 = lb
   */
  static kgToPound(kg: number): number {
    return kg / 0.453592;
  }

  // ==================== BODY METRICS ====================
  
  /**
   * Calculate BMI
   * Formula: weight ÷ (height in cm ÷ 100)²
   */
  static calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }

  /**
   * Calculate Ideal Body Weight range
   * Formula: 19.5 × (height in cm ÷ 100)² to 25 × (height in cm ÷ 100)²
   */
  static calculateIdealBodyWeight(heightCm: number): { min: number; max: number } {
    const heightM = heightCm / 100;
    const heightSquared = heightM * heightM;
    return {
      min: 19.5 * heightSquared,
      max: 25 * heightSquared
    };
  }

  // ==================== BLOOD PRESSURE ====================
  
  /**
   * Calculate Mean Arterial Pressure (MAP)
   * Formula: [SBP + (2 × DBP)] / 3
   */
  static calculateMAP(systolic: number, diastolic: number): number {
    return (systolic + (2 * diastolic)) / 3;
  }

  // ==================== RENAL FUNCTION TESTS (RFT) ====================
  
  /**
   * Convert Creatinine mg/dL to µmol/L
   * Formula: mg/dL × 88.42 = µmol/L
   */
  static creatinineMgToUmol(mgDl: number): number {
    return mgDl * 88.42;
  }

  /**
   * Convert Creatinine µmol/L to mg/dL
   * Formula: µmol/L ÷ 88.42 = mg/dL
   */
  static creatinineUmolToMg(umolL: number): number {
    return umolL / 88.42;
  }

  /**
   * Calculate MELD Score
   * Formula: MELD = 9.57 × log₁₀(creatinine mg/dL) + 3.78 × log₁₀(bilirubin mg/dL) + 11.20 × log₁₀(INR) + 6.43
   * Note: If dialysis 2 times in past week OR CVVH for 24+ hours, creatinine = 4.0
   * Max values: creatinine 4.0, bilirubin 4.0, INR capped
   */
  static calculateMELD(
    creatinineMgDl: number,
    bilirubinMgDl: number,
    inr: number,
    onDialysis: boolean = false
  ): number {
    // Apply caps and dialysis logic
    let creat = Math.max(1.0, Math.min(creatinineMgDl, 4.0));
    if (onDialysis) {
      creat = 4.0;
    }
    const bili = Math.max(1.0, Math.min(bilirubinMgDl, 4.0));
    const inrCapped = Math.max(1.0, inr);

    // MELD formula
    const meld = (9.57 * Math.log10(creat)) + 
                 (3.78 * Math.log10(bili)) + 
                 (11.20 * Math.log10(inrCapped)) + 
                 6.43;
    
    // Round to integer, min 6, max 40
    return Math.round(Math.max(6, Math.min(40, meld)));
  }

  /**
   * Calculate MELD-Na Score
   * Formula: MELD + 1.59 × (135 - Na)
   * Where Na is capped between 125-135 mmol/L
   */
  static calculateMELDNa(meldScore: number, sodiumMmol: number): number {
    const naCapped = Math.max(125, Math.min(135, sodiumMmol));
    const meldNa = meldScore + (1.59 * (135 - naCapped));
    
    // Round to integer, min 6, max 40
    return Math.round(Math.max(6, Math.min(40, meldNa)));
  }

  // ==================== LIVER FUNCTION TESTS (LFT) ====================
  
  /**
   * Convert Bilirubin µmol/L to mg/dL
   * Formula: µmol/L ÷ 17.1 = mg/dL
   */
  static bilirubinUmolToMg(umolL: number): number {
    return umolL / 17.1;
  }

  /**
   * Convert Bilirubin mg/dL to µmol/L
   * Formula: mg/dL × 17.1 = µmol/L
   */
  static bilirubinMgToUmol(mgDl: number): number {
    return mgDl * 17.1;
  }

  /**
   * Calculate INR from Prothrombin Time
   * Formula: INR = (Patient PT / Control PT)^ISI
   * Typically ISI ≈ 1.0 for most reagents
   */
  static calculateINR(patientPT: number, controlPT: number, isi: number = 1.0): number {
    return Math.pow(patientPT / controlPT, isi);
  }

  /**
   * Convert HBV DNA C/mL to IU/mL
   * Formula: C/mL ÷ 5.6 = IU/mL
   */
  static hbvDnaCopiesToIU(copiesPerMl: number): number {
    return copiesPerMl / 5.6;
  }

  /**
   * Convert HBV DNA IU/mL to C/mL
   * Formula: IU/mL × 5.6 = C/mL
   */
  static hbvDnaIUToCopies(iuPerMl: number): number {
    return iuPerMl * 5.6;
  }

  /**
   * Convert HCV RNA C/mL to IU/mL
   * Formula: C/mL ÷ 4.4 = IU/mL
   */
  static hcvRnaCopiesToIU(copiesPerMl: number): number {
    return copiesPerMl / 4.4;
  }

  /**
   * Convert HCV RNA IU/mL to C/mL
   * Formula: IU/mL × 4.4 = C/mL
   */
  static hcvRnaIUToCopies(iuPerMl: number): number {
    return iuPerMl * 4.4;
  }

  /**
   * Calculate A/G Ratio (Albumin/Globulin Ratio)
   */
  static calculateAGRatio(albumin: number, globulin: number): number {
    if (globulin === 0) return 0;
    return albumin / globulin;
  }

  /**
   * Calculate Globulin from Total Protein and Albumin
   * Formula: Globulin = Total Protein - Albumin
   */
  static calculateGlobulin(totalProtein: number, albumin: number): number {
    return totalProtein - albumin;
  }

  /**
   * Calculate Child-Pugh Score
   * Returns score (5-15) and class (A/B/C)
   */
  static calculateChildPugh(params: {
    bilirubinMgDl: number;
    albuminGdL: number;
    inr: number;
    ascites: 'Absent' | 'Mild' | 'Moderate' | 'Severe';
    encephalopathy: 'No encephalopathy' | 'Grade I' | 'Grade II' | 'Grade III' | 'Grade IV';
  }): { score: number; class: 'A' | 'B' | 'C' } {
    let score = 0;

    // Bilirubin points
    if (params.bilirubinMgDl < 2) score += 1;
    else if (params.bilirubinMgDl <= 3) score += 2;
    else score += 3;

    // Albumin points
    if (params.albuminGdL > 3.5) score += 1;
    else if (params.albuminGdL >= 2.8) score += 2;
    else score += 3;

    // INR points
    if (params.inr < 1.7) score += 1;
    else if (params.inr <= 2.3) score += 2;
    else score += 3;

    // Ascites points
    if (params.ascites === 'Absent') score += 1;
    else if (params.ascites === 'Mild') score += 2;
    else score += 3;

    // Encephalopathy points
    if (params.encephalopathy === 'No encephalopathy') score += 1;
    else if (params.encephalopathy === 'Grade I' || params.encephalopathy === 'Grade II') score += 2;
    else score += 3;

    // Determine class
    let pughClass: 'A' | 'B' | 'C';
    if (score <= 6) pughClass = 'A';
    else if (score <= 9) pughClass = 'B';
    else pughClass = 'C';

    return { score, class: pughClass };
  }

  // ==================== HEMATOLOGY ====================
  
  /**
   * Calculate Transferrin Saturation (TSAT)
   * Formula: TSAT = (Fe ÷ TIBC) × 100
   */
  static calculateTSAT(serumIron: number, tibc: number): number {
    if (tibc === 0) return 0;
    return (serumIron / tibc) * 100;
  }

  /**
   * Calculate Serum Iron in µg/dL from µmol/L
   * Formula: µmol/L × 5.586 = µg/dL
   */
  static ironUmolToUg(umolL: number): number {
    return umolL * 5.586;
  }

  /**
   * Calculate Serum Iron in µmol/L from µg/dL
   * Formula: µg/dL ÷ 5.586 = µmol/L
   */
  static ironUgToUmol(ugDl: number): number {
    return ugDl / 5.586;
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  /**
   * Round to specified decimal places
   */
  static round(value: number, decimals: number = 2): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Format number with unit
   */
  static formatWithUnit(value: number, unit: string, decimals: number = 2): string {
    return `${this.round(value, decimals)} ${unit}`;
  }
}

