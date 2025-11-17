/**
 * Clinical Data Processor Service
 * Automatically applies calculations and conversions to clinical data
 */

import { ClinicalCalculations } from '@/shared/utils';
import { logger } from '@/shared/utils';

export class ClinicalDataProcessor {
  /**
   * Process On Examination data - apply automatic calculations
   */
  static processOnExamination(values: Record<string, any>): Record<string, any> {
    const processed = { ...values };

    try {
      // Height conversions
      if (processed.heightFeet !== undefined && processed.heightInch !== undefined) {
        processed.heightCm = ClinicalCalculations.round(
          ClinicalCalculations.feetInchToCm(
            Number(processed.heightFeet),
            Number(processed.heightInch)
          ),
          2
        );
      } else if (processed.heightCm) {
        const { feet, inch } = ClinicalCalculations.cmToFeetInch(Number(processed.heightCm));
        processed.heightFeet = feet;
        processed.heightInch = inch;
      }

      // Weight conversions
      if (processed.weightLb && !processed.weightKg) {
        processed.weightKg = ClinicalCalculations.round(
          ClinicalCalculations.poundToKg(Number(processed.weightLb)),
          2
        );
      } else if (processed.weightKg && !processed.weightLb) {
        processed.weightLb = ClinicalCalculations.round(
          ClinicalCalculations.kgToPound(Number(processed.weightKg)),
          2
        );
      }

      // BMI calculation
      if (processed.heightCm && processed.weightKg) {
        processed.bmi = ClinicalCalculations.round(
          ClinicalCalculations.calculateBMI(
            Number(processed.weightKg),
            Number(processed.heightCm)
          ),
          2
        );
      }

      // Ideal Body Weight calculation
      if (processed.heightCm) {
        const ibw = ClinicalCalculations.calculateIdealBodyWeight(Number(processed.heightCm));
        processed.idealBodyWeightMin = ClinicalCalculations.round(ibw.min, 2);
        processed.idealBodyWeightMax = ClinicalCalculations.round(ibw.max, 2);
        processed.idealBodyWeightRange = `${processed.idealBodyWeightMin}-${processed.idealBodyWeightMax} kg`;
      }

      // Mean Arterial Pressure (MAP)
      if (processed.systolic && processed.diastolic) {
        processed.meanArterialPressure = ClinicalCalculations.round(
          ClinicalCalculations.calculateMAP(
            Number(processed.systolic),
            Number(processed.diastolic)
          ),
          1
        );
      }
    } catch (error) {
      logger.error('Error processing On Examination data:', error);
    }

    return processed;
  }

  /**
   * Process Hematology data - apply automatic calculations
   */
  static processHematology(values: Record<string, any>): Record<string, any> {
    const processed = { ...values };

    try {
      // TSAT calculation (Transferrin Saturation)
      if (processed.serumIron && processed.tibc) {
        processed.tsat = ClinicalCalculations.round(
          ClinicalCalculations.calculateTSAT(
            Number(processed.serumIron),
            Number(processed.tibc)
          ),
          1
        );
      }

      // Iron unit conversions
      if (processed.serumIronUmol && !processed.serumIron) {
        processed.serumIron = ClinicalCalculations.round(
          ClinicalCalculations.ironUmolToUg(Number(processed.serumIronUmol)),
          2
        );
      } else if (processed.serumIron && !processed.serumIronUmol) {
        processed.serumIronUmol = ClinicalCalculations.round(
          ClinicalCalculations.ironUgToUmol(Number(processed.serumIron)),
          2
        );
      }
    } catch (error) {
      logger.error('Error processing Hematology data:', error);
    }

    return processed;
  }

  /**
   * Process LFT (Liver Function Tests) data - apply automatic calculations
   */
  static processLFT(values: Record<string, any>): Record<string, any> {
    const processed = { ...values };

    try {
      // Bilirubin conversions
      if (processed.bilirubinTotalUmol && !processed.bilirubinTotal) {
        processed.bilirubinTotal = ClinicalCalculations.round(
          ClinicalCalculations.bilirubinUmolToMg(Number(processed.bilirubinTotalUmol)),
          2
        );
      } else if (processed.bilirubinTotal && !processed.bilirubinTotalUmol) {
        processed.bilirubinTotalUmol = ClinicalCalculations.round(
          ClinicalCalculations.bilirubinMgToUmol(Number(processed.bilirubinTotal)),
          2
        );
      }

      if (processed.bilirubinDirectUmol && !processed.bilirubinDirect) {
        processed.bilirubinDirect = ClinicalCalculations.round(
          ClinicalCalculations.bilirubinUmolToMg(Number(processed.bilirubinDirectUmol)),
          2
        );
      } else if (processed.bilirubinDirect && !processed.bilirubinDirectUmol) {
        processed.bilirubinDirectUmol = ClinicalCalculations.round(
          ClinicalCalculations.bilirubinMgToUmol(Number(processed.bilirubinDirect)),
          2
        );
      }

      // Calculate indirect bilirubin if total and direct are available
      if (processed.bilirubinTotal && processed.bilirubinDirect) {
        processed.bilirubinIndirect = ClinicalCalculations.round(
          Number(processed.bilirubinTotal) - Number(processed.bilirubinDirect),
          2
        );
      }

      // INR calculation
      if (processed.prothrombinTime && processed.controlPT) {
        processed.inr = ClinicalCalculations.round(
          ClinicalCalculations.calculateINR(
            Number(processed.prothrombinTime),
            Number(processed.controlPT),
            Number(processed.isi || 1.0)
          ),
          2
        );
      }

      // A/G Ratio calculation
      if (processed.albumin && processed.globulin) {
        processed.agRatio = ClinicalCalculations.round(
          ClinicalCalculations.calculateAGRatio(
            Number(processed.albumin),
            Number(processed.globulin)
          ),
          2
        );
      }

      // Calculate Globulin if Total Protein and Albumin are available
      if (processed.totalProtein && processed.albumin && !processed.globulin) {
        processed.globulin = ClinicalCalculations.round(
          ClinicalCalculations.calculateGlobulin(
            Number(processed.totalProtein),
            Number(processed.albumin)
          ),
          2
        );
      }

      // HBV DNA conversions
      if (processed.hbvDnaCopies && !processed.hbvDna) {
        processed.hbvDna = ClinicalCalculations.round(
          ClinicalCalculations.hbvDnaCopiesToIU(Number(processed.hbvDnaCopies)),
          0
        );
      } else if (processed.hbvDna && !processed.hbvDnaCopies) {
        processed.hbvDnaCopies = ClinicalCalculations.round(
          ClinicalCalculations.hbvDnaIUToCopies(Number(processed.hbvDna)),
          0
        );
      }

      // HCV RNA conversions
      if (processed.hcvRnaCopies && !processed.hcvRna) {
        processed.hcvRna = ClinicalCalculations.round(
          ClinicalCalculations.hcvRnaCopiesToIU(Number(processed.hcvRnaCopies)),
          0
        );
      } else if (processed.hcvRna && !processed.hcvRnaCopies) {
        processed.hcvRnaCopies = ClinicalCalculations.round(
          ClinicalCalculations.hcvRnaIUToCopies(Number(processed.hcvRna)),
          0
        );
      }

      // Child-Pugh Score calculation
      if (
        processed.bilirubinTotal &&
        processed.albumin &&
        processed.inr &&
        processed.ascites &&
        processed.hepaticEncephalopathy
      ) {
        const childPugh = ClinicalCalculations.calculateChildPugh({
          bilirubinMgDl: Number(processed.bilirubinTotal),
          albuminGdL: Number(processed.albumin),
          inr: Number(processed.inr),
          ascites: processed.ascites,
          encephalopathy: processed.hepaticEncephalopathy
        });
        processed.childPughScore = childPugh.score;
        processed.childPughClass = childPugh.class;
      }
    } catch (error) {
      logger.error('Error processing LFT data:', error);
    }

    return processed;
  }

  /**
   * Process RFT (Renal Function Tests) data - apply automatic calculations
   */
  static processRFT(values: Record<string, any>): Record<string, any> {
    const processed = { ...values };

    try {
      // Creatinine conversions
      if (processed.creatinine && !processed.creatinineUmol) {
        processed.creatinineUmol = ClinicalCalculations.round(
          ClinicalCalculations.creatinineMgToUmol(Number(processed.creatinine)),
          2
        );
      } else if (processed.creatinineUmol && !processed.creatinine) {
        processed.creatinine = ClinicalCalculations.round(
          ClinicalCalculations.creatinineUmolToMg(Number(processed.creatinineUmol)),
          2
        );
      }

      // MELD Score calculation (needs bilirubin and INR from LFT data, passed in meta)
      if (processed.creatinine) {
        const bilirubinMgDl = processed._bilirubinTotal || 1.0;
        const inr = processed._inr || 1.0;
        const onDialysis = processed._onDialysis === 'Yes';

        processed.meldScore = ClinicalCalculations.calculateMELD(
          Number(processed.creatinine),
          Number(bilirubinMgDl),
          Number(inr),
          onDialysis
        );

        // MELD-Na Score calculation
        if (processed.sodium) {
          processed.meldNaScore = ClinicalCalculations.calculateMELDNa(
            processed.meldScore,
            Number(processed.sodium)
          );
        }
      }
    } catch (error) {
      logger.error('Error processing RFT data:', error);
    }

    return processed;
  }

  /**
   * Main processor - routes to appropriate section processor
   */
  static process(section: string, values: Record<string, any>): Record<string, any> {
    switch (section) {
      case 'ON_EXAMINATION':
        return this.processOnExamination(values);
      case 'HEMATOLOGY':
        return this.processHematology(values);
      case 'LFT':
        return this.processLFT(values);
      case 'RFT':
        return this.processRFT(values);
      default:
        return values;
    }
  }
}

