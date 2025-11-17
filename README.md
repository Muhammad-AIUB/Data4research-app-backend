# Data4Research App - Backend API

A comprehensive **Medical Investigation Profile Management System** built with Node.js, Express, and TypeScript. This backend API manages patient records, clinical data, medical investigations, and generates detailed reports for healthcare research purposes.

## 🎯 Project Overview

This is a production-ready RESTful API backend designed for managing medical patient data, clinical examinations, laboratory test results (Hematology, Liver Function Tests, Renal Function Tests), and generating comprehensive Excel reports. The system follows **Clean Architecture** principles with domain-driven design, ensuring maintainability and scalability.

## ✨ Key Features

- **Patient Management**: Complete CRUD operations for patient profiles with demographic data, medical history, and contact information
- **Clinical Data Management**: Store and manage clinical examination data, hematology panels, LFT, and RFT results
- **Automatic Calculations**: Built-in formulas for BMI, MAP, MELD scores, unit conversions, and clinical calculations
- **Medical Investigations**: Track investigation sessions with test results and findings
- **Image Management**: Upload and manage patient images and investigation reports
- **Excel Export**: Generate detailed Excel reports for patients, investigations, and clinical data
- **Authentication & Authorization**: JWT-based secure authentication system
- **Data Validation**: Comprehensive input validation using Zod schemas
- **Database Migrations**: Prisma ORM with PostgreSQL for robust data management

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt for password hashing

### Key Libraries
- **Prisma**: Type-safe database ORM
- **Zod**: Schema validation
- **ExcelJS**: Excel file generation
- **Multer**: File upload handling
- **Winston**: Logging
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing

## 📁 Project Structure

```
src/
├── application/          # Application layer (Use Cases, DTOs, Validators)
│   ├── dto/             # Data Transfer Objects
│   ├── use-cases/       # Business logic (Create, Read, Update, Delete)
│   ├── validators/      # Zod validation schemas
│   └── services/        # Application services
├── domain/              # Domain layer (Entities, Interfaces)
│   ├── entities/       # Domain entities (Patient, User, etc.)
│   └── interfaces/      # Repository interfaces
├── infrastructure/      # Infrastructure layer
│   ├── database/       # Prisma repositories
│   ├── auth/           # JWT and password services
│   ├── excel/          # Excel export service
│   └── storage/        # File storage service
├── interfaces/         # Interface adapters
│   └── http/           # HTTP controllers, routes, middlewares
└── shared/             # Shared utilities and constants
    ├── constants/      # Application constants
    ├── errors/         # Custom error classes
    └── utils/          # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or Neon/Supabase for cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data4research-app-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   JWT_SECRET="your-secret-key"
   NODE_ENV="development"
   PORT=3000
   CORS_ORIGIN="http://localhost:3000"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Patients
- `POST /api/v1/patients` - Create patient
- `GET /api/v1/patients` - List all patients (paginated)
- `GET /api/v1/patients/search` - Search patients
- `GET /api/v1/patients/:id` - Get patient by ID
- `PUT /api/v1/patients/:id` - Update patient
- `DELETE /api/v1/patients/:id` - Delete patient

### Clinical Data
- `POST /api/v1/clinical` - Create clinical entry (On Examination, Hematology, LFT, RFT)
- `GET /api/v1/clinical/:patientId/clinical?section=ON_EXAMINATION` - List clinical entries
- `GET /api/v1/clinical/:entryId` - Get clinical entry by ID
- `PUT /api/v1/clinical/:entryId` - Update clinical entry
- `DELETE /api/v1/clinical/:entryId` - Delete clinical entry

### Investigations
- `POST /api/v1/investigations` - Create investigation session
- `GET /api/v1/investigations/:id` - Get investigation by ID
- `GET /api/v1/investigations/patient/:patientId` - List patient investigations
- `DELETE /api/v1/investigations/:id` - Delete investigation

### Images
- `POST /api/v1/images/patient/:patientId` - Upload patient image
- `GET /api/v1/images/patient/:patientId` - Get patient images
- `DELETE /api/v1/images/patient/:imageId` - Delete patient image
- `POST /api/v1/images/investigation/:investigationId` - Upload investigation image
- `GET /api/v1/images/investigation/:investigationId` - Get investigation images

### Export
- `GET /api/v1/export/patients` - Export all patients to Excel
- `GET /api/v1/export/patient/:patientId` - Export patient report
- `GET /api/v1/export/investigation/:investigationId` - Export investigation report

### Utilities
- `GET /api/v1/dropdown/options` - Get dropdown options (ethnicity, religion, districts, etc.)
- `GET /health` - Health check endpoint

## 🏗️ Architecture

This project follows **Clean Architecture** principles:

- **Domain Layer**: Core business entities and interfaces (database-agnostic)
- **Application Layer**: Use cases and business logic
- **Infrastructure Layer**: Database, external services, file storage
- **Interface Layer**: HTTP controllers, routes, and middleware

This separation ensures:
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add new features or swap implementations

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation with Zod schemas
- Security headers with Helmet
- CORS configuration
- SQL injection protection (Prisma ORM)

## 📊 Database Schema

The database includes the following main entities:
- **Users**: System users (doctors, admins)
- **Patients**: Patient profiles with demographic and medical data
- **Patient Examinations**: Clinical examination records
- **Patient Hematology Panels**: Hematology test results
- **Patient LFT Panels**: Liver function test results
- **Patient RFT Panels**: Renal function test results
- **Investigation Sessions**: Medical investigation records
- **Patient Images**: Patient-related images
- **Investigation Images**: Investigation-related images

## 🧪 Testing

All API endpoints have been tested and verified. The system includes:
- Comprehensive input validation
- Error handling and proper HTTP status codes
- Database transaction management
- File upload validation

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations

## 🌟 Key Highlights for Recruiters

- **Production-Ready**: Fully functional API with comprehensive error handling
- **Clean Code**: Follows Clean Architecture and SOLID principles
- **Type-Safe**: Full TypeScript implementation with strict type checking
- **Scalable Design**: Modular architecture allows easy feature additions
- **Well-Documented**: Clear code structure and comprehensive API endpoints
- **Security-First**: JWT authentication, password hashing, input validation
- **Database Management**: Prisma ORM with migrations for schema management
- **Real-World Application**: Medical data management system with complex business logic

## 📄 License

This project is proprietary software developed for Data4Research.

## 👤 Author

Developed as part of the Data4Research medical investigation management system.

---

**Note**: This backend API is designed to work with a frontend application for a complete medical data management solution.

