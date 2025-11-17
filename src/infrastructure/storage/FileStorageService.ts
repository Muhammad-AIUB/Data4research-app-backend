import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { ValidationError } from '@/shared/errors';

export class FileStorageService {
  private uploadDir: string;
  
  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    
    const patientsDir = path.join(this.uploadDir, 'patients');
    if (!fs.existsSync(patientsDir)) {
      fs.mkdirSync(patientsDir, { recursive: true });
    }
    
    const investigationsDir = path.join(this.uploadDir, 'investigations');
    if (!fs.existsSync(investigationsDir)) {
      fs.mkdirSync(investigationsDir, { recursive: true });
    }
  }

  async savePatientImage(file: Express.Multer.File, patientId: string): Promise<string> {
    const ext = path.extname(file.originalname);
    const filename = `${uuid()}${ext}`;
    const filepath = path.join(this.uploadDir, 'patients', filename);
    
    await fs.promises.writeFile(filepath, file.buffer);
    
    return `/uploads/patients/${filename}`;
  }

  async saveInvestigationImage(file: Express.Multer.File, investigationId: string): Promise<string> {
    const ext = path.extname(file.originalname);
    const filename = `${uuid()}${ext}`;
    const filepath = path.join(this.uploadDir, 'investigations', filename);
    
    await fs.promises.writeFile(filepath, file.buffer);
    
    return `/uploads/investigations/${filename}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }

  getFilePath(relativePath: string): string {
    return path.join(process.cwd(), relativePath);
  }

  validateImageFile(file: Express.Multer.File): void {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
    
    if (!allowedMimes.includes(file.mimetype)) {
      throw new ValidationError('Only image files are allowed (JPEG, PNG, GIF, WebP, BMP, TIFF)');
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new ValidationError('Image file size must not exceed 10MB');
    }
  }
}