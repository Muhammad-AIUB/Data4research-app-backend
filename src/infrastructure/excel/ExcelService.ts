import ExcelJS from 'exceljs';
import { Patient } from '@/domain/entities/Patient';

export class ExcelService {
  
  async exportPatients(patients: Patient[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Patients');

    worksheet.columns = [
      { header: 'Patient ID', key: 'patientId', width: 15 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Sex', key: 'sex', width: 10 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'District', key: 'district', width: 15 },
      { header: 'Final Diagnosis', key: 'diagnosis', width: 40 },
      { header: 'Created Date', key: 'createdAt', width: 20 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    patients.forEach(patient => {
      worksheet.addRow({
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        sex: patient.sex,
        mobile: patient.patientMobile || 'N/A',
        district: patient.district || 'N/A',
        diagnosis: patient.finalDiagnosis || 'N/A',
        createdAt: patient.createdAt.toLocaleDateString()
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async exportPatientWithInvestigations(
    patient: Patient,
    investigations: any[]
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    const patientSheet = workbook.addWorksheet('Patient Info');
    patientSheet.columns = [
      { header: 'Field', key: 'field', width: 25 },
      { header: 'Value', key: 'value', width: 50 }
    ];

    patientSheet.getRow(1).font = { bold: true };
    patientSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    patientSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    const patientInfo = [
      { field: 'Patient ID', value: patient.patientId },
      { field: 'Name', value: patient.name },
      { field: 'Date of Birth', value: patient.dateOfBirth.toISOString().split('T')[0] },
      { field: 'Age', value: patient.age.toString() },
      { field: 'Sex', value: patient.sex },
      { field: 'Ethnicity', value: patient.ethnicity },
      { field: 'Religion', value: patient.religion },
      { field: 'Mobile', value: patient.patientMobile },
      { field: 'First Degree Relative Mobile', value: patient.firstDegreeRelativeMobile },
      { field: 'District', value: patient.district },
      { field: 'Address Details', value: patient.addressDetails || 'N/A' },
      { field: 'Short History', value: patient.shortHistory },
      { field: 'Surgical History', value: patient.surgicalHistory },
      { field: 'Family History', value: patient.familyHistory },
      { field: 'Past Illness', value: patient.pastIllness },
      { field: 'Final Diagnosis', value: patient.finalDiagnosis }
    ];

    patientInfo.forEach(info => {
      patientSheet.addRow(info);
    });

    if (investigations && investigations.length > 0) {
      investigations.forEach((investigation, index) => {
        const invSheet = workbook.addWorksheet(`Investigation ${index + 1}`);
        
        invSheet.mergeCells('A1:D1');
        const titleCell = invSheet.getCell('A1');
        titleCell.value = `Investigation Date: ${new Date(investigation.session.investigationDate).toLocaleDateString()}`;
        titleCell.font = { bold: true, size: 14 };
        titleCell.alignment = { horizontal: 'center' };

        let currentRow = 3;

        if (investigation.hematology && investigation.hematology.length > 0) {
          invSheet.getCell(`A${currentRow}`).value = 'HEMATOLOGY';
          invSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
          invSheet.getCell(`A${currentRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9E1F2' }
          };
          currentRow++;

          invSheet.getRow(currentRow).values = ['Test Name', 'Value', 'Unit', 'Notes'];
          invSheet.getRow(currentRow).font = { bold: true };
          currentRow++;

          investigation.hematology.forEach((test: any) => {
            invSheet.addRow([test.testName, test.value, test.unit || 'N/A', test.notes || 'N/A']);
            currentRow++;
          });
          currentRow++;
        }

        if (investigation.lft && investigation.lft.length > 0) {
          invSheet.getCell(`A${currentRow}`).value = 'LIVER FUNCTION TEST (LFT)';
          invSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
          invSheet.getCell(`A${currentRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9E1F2' }
          };
          currentRow++;

          invSheet.getRow(currentRow).values = ['Test Name', 'Value', 'Unit', 'Method', 'Notes'];
          invSheet.getRow(currentRow).font = { bold: true };
          currentRow++;

          investigation.lft.forEach((test: any) => {
            invSheet.addRow([test.testName, test.value, test.unit || 'N/A', test.testMethod || 'N/A', test.notes || 'N/A']);
            currentRow++;
          });
          currentRow++;
        }

        if (investigation.rft && investigation.rft.length > 0) {
          invSheet.getCell(`A${currentRow}`).value = 'RENAL FUNCTION TEST (RFT)';
          invSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
          invSheet.getCell(`A${currentRow}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9E1F2' }
          };
          currentRow++;

          invSheet.getRow(currentRow).values = ['Test Name', 'Value', 'Unit', 'Notes'];
          invSheet.getRow(currentRow).font = { bold: true };
          currentRow++;

          investigation.rft.forEach((test: any) => {
            invSheet.addRow([test.testName, test.value, test.unit || 'N/A', test.notes || 'N/A']);
            currentRow++;
          });
        }

        invSheet.columns = [
          { width: 25 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 30 }
        ];
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async exportInvestigationReport(investigation: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Investigation Report');

    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'INVESTIGATION REPORT';
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };

    worksheet.getCell('A3').value = 'Investigation Date:';
    worksheet.getCell('A3').font = { bold: true };
    worksheet.getCell('B3').value = new Date(investigation.session.investigationDate).toLocaleDateString();

    let currentRow = 5;

    if (investigation.hematology && investigation.hematology.length > 0) {
      worksheet.getCell(`A${currentRow}`).value = 'HEMATOLOGY TESTS';
      worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
      worksheet.getCell(`A${currentRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' }
      };
      currentRow += 2;

      worksheet.getRow(currentRow).values = ['Test Name', 'Value', 'Unit', 'Favourite', 'Notes'];
      worksheet.getRow(currentRow).font = { bold: true };
      worksheet.getRow(currentRow).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7E6E6' }
      };
      currentRow++;

      investigation.hematology.forEach((test: any) => {
        worksheet.addRow([
          test.testName,
          test.value,
          test.unit || 'N/A',
          test.isFavourite ? 'Yes' : 'No',
          test.notes || 'N/A'
        ]);
        currentRow++;
      });
      currentRow += 2;
    }

    if (investigation.lft && investigation.lft.length > 0) {
      worksheet.getCell(`A${currentRow}`).value = 'LIVER FUNCTION TEST (LFT)';
      worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
      worksheet.getCell(`A${currentRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' }
      };
      currentRow += 2;

      worksheet.getRow(currentRow).values = ['Test Name', 'Value', 'Unit', 'Method', 'Favourite', 'Notes'];
      worksheet.getRow(currentRow).font = { bold: true };
      worksheet.getRow(currentRow).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7E6E6' }
      };
      currentRow++;

      investigation.lft.forEach((test: any) => {
        worksheet.addRow([
          test.testName,
          test.value,
          test.unit || 'N/A',
          test.testMethod || 'N/A',
          test.isFavourite ? 'Yes' : 'No',
          test.notes || 'N/A'
        ]);
        currentRow++;
      });
      currentRow += 2;
    }

    if (investigation.rft && investigation.rft.length > 0) {
      worksheet.getCell(`A${currentRow}`).value = 'RENAL FUNCTION TEST (RFT)';
      worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
      worksheet.getCell(`A${currentRow}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' }
      };
      currentRow += 2;

      worksheet.getRow(currentRow).values = ['Test Name', 'Value', 'Unit', 'Favourite', 'Notes'];
      worksheet.getRow(currentRow).font = { bold: true };
      worksheet.getRow(currentRow).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7E6E6' }
      };
      currentRow++;

      investigation.rft.forEach((test: any) => {
        worksheet.addRow([
          test.testName,
          test.value,
          test.unit || 'N/A',
          test.isFavourite ? 'Yes' : 'No',
          test.notes || 'N/A'
        ]);
        currentRow++;
      });
    }

    worksheet.columns = [
      { width: 30 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 35 }
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}