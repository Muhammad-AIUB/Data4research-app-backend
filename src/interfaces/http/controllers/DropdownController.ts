import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@/shared/constants';
import {
  SEX_OPTIONS,
  ETHNICITY_OPTIONS,
  ETHNICITY_WITH_SUBGROUPS,
  RELIGION_OPTIONS,
  DISTRICT_OPTIONS,
  HEMATOLOGY_TEST_NAMES,
  LFT_TEST_NAMES,
  RFT_TEST_NAMES,
  TEST_METHODS,
  CLINICAL_DROPDOWNS,
  ON_EXAMINATION_FIELDS,
  HEMATOLOGY_FIELDS,
  LFT_FIELDS,
  RFT_FIELDS
} from '@/shared/constants';

export class DropdownController {
  getOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          sex: Array.from(SEX_OPTIONS),
          ethnicity: Array.from(ETHNICITY_OPTIONS),
          ethnicityWithSubgroups: ETHNICITY_WITH_SUBGROUPS,
          religion: Array.from(RELIGION_OPTIONS),
          district: Array.from(DISTRICT_OPTIONS),
          hematologyTestNames: Array.from(HEMATOLOGY_TEST_NAMES),
          lftTestNames: Array.from(LFT_TEST_NAMES),
          rftTestNames: Array.from(RFT_TEST_NAMES),
          testMethods: Array.from(TEST_METHODS),
          clinical: {
            dropdowns: CLINICAL_DROPDOWNS,
            fields: {
              onExamination: ON_EXAMINATION_FIELDS,
              hematology: HEMATOLOGY_FIELDS,
              lft: LFT_FIELDS,
              rft: RFT_FIELDS
            }
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

