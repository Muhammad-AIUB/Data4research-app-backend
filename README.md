# Medical Investigation Backend - Step by Step Build Guide

## 📚 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Testing](#testing)
6. [Deployment](#deployment)

---

## Architecture Overview

This backend follows **Clean Architecture** principles with these layers:

```
┌─────────────────────────────────────────┐
│  Layer 1: Domain (Entities)             │  ← Pure business logic
│  └─ Patient, Investigation, User        │
│                                          │
│  Layer 2: Application (Use Cases)       │  ← Business workflows
│  └─ CreatePatient, SearchPatient        │
│                                          │
│  Layer 3: Interface Adapters            │  ← HTTP controllers
│  └─ PatientController, Routes           │
│                                          │
│  Layer 4: Infrastructure                │  ← External services
│  └─ Prisma, Supabase, Redis            │
└─────────────────────────────────────────┘
```

**Why Clean Architecture?**
- ✅ **Testable:** Each layer can be tested independently
- ✅ **Maintainable:** Easy to understand and modify
- ✅ **Scalable:** Add features without breaking existing code
- ✅ **Flexible:** Switch databases or frameworks easily
- ✅ **Team-friendly:** Multiple developers can work simultaneously

---

## Prerequisites

### Required Software:
```bash
# 1. Node.js (v18 or higher)
node --version  # Should show v18.x.x or higher

# 2. npm (comes with Node.js)
npm --version   # Should show 9.x.x or higher

# 3. Git
git --version   # Any recent version
```

### Accounts Needed (All FREE):
1. **Supabase Account** - https://supabase.com (for database & storage)
2. **Upstash Account** - https://upstash.com (for Redis cache)
3. **GitHub Account** - https://github.com (for version control)

---

## Initial Setup

### Step 1: Create Project

```bash
# Create project directory
mkdir medical-app-backend
cd medical-app-backend

# Initialize git
git init

# Copy all the files we've created:
# - package.json
# - tsconfig.json
# - .env.example
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# This will install:
# - Express (HTTP server)
# - Prisma (Database ORM)
# - Supabase Client (Storage & Auth)
# - ExcelJS (Excel generation)
# - Zod (Validation)
# - Winston (Logging)
# - And many more...
```

**Explanation of Key Dependencies:**

1. **express** - Web framework for building APIs
   ```typescript
   // Simple HTTP server
   app.get('/api/patients', (req, res) => {
     res.json({ patients: [] });
   });
   ```

2. **@prisma/client** - Type-safe database client
   ```typescript
   // Type-safe database queries
   const patient = await prisma.patient.findUnique({
     where: { id: '123' }
   });
   ```

3. **zod** - Runtime type validation
   ```typescript
   // Validate incoming data
   const schema = z.object({
     name: z.string(),
     age: z.number()
   });
   ```

4. **jsonwebtoken** - JWT authentication
   ```typescript
   // Generate auth tokens
   const token = jwt.sign({ userId: '123' }, secret);
   ```

### Step 3: Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
nano .env  # or use VS Code
```

### Step 4: Setup Supabase

1. Go to https://supabase.com
2. Create new project
3. Wait 2-3 minutes for setup
4. Go to Settings > Database > Connection String
5. Copy the connection string
6. Paste in `.env` as `DATABASE_URL`

### Step 5: Setup Upstash Redis

1. Go to https://upstash.com
2. Create new Redis database
3. Copy REST URL and TOKEN
4. Paste in `.env`

---

## Step-by-Step Implementation

We'll build the backend in this order:

### Phase 1: Foundation (Week 1)
1. ✅ Project setup (Done!)
2. 📝 Domain layer (Entities)
3. 📝 Error handling
4. 📝 Logger setup

### Phase 2: Core Logic (Week 2)
5. 📝 Repository interfaces
6. 📝 Use cases
7. 📝 Database repositories

### Phase 3: HTTP Layer (Week 3)
8. 📝 Controllers
9. 📝 Routes
10. 📝 Middlewares

### Phase 4: Features (Week 4)
11. 📝 Authentication
12. 📝 Excel generation
13. 📝 Search & pagination

### Phase 5: Polish (Week 5)
14. 📝 Testing
15. 📝 Documentation
16. 📝 Deployment

---

## Let's Start: Creating First Files

### File 1: Shared Errors

**Why?** We need consistent error handling across the application.

```typescript
// src/shared/errors/AppError.ts
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
```

**Explanation:**
- `AppError` is our base error class
- `statusCode`: HTTP status code (400, 404, 500, etc.)
- `isOperational`: true = expected error, false = unexpected bug
- We extend JavaScript's built-in `Error` class

**Usage:**
```typescript
// In your code:
throw new AppError('Patient not found', 404);

// Instead of:
throw new Error('Patient not found'); // No status code!
```

### File 2: Logger

**Why?** We need to track what's happening in our application.

```typescript
// src/shared/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Write to console
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    // Write errors to file
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Write all logs to file
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});
```

**Explanation:**
- Winston is a logging library
- We log to both console and files
- `timestamp`: Adds time to each log
- `errors({ stack: true })`: Includes error stack traces
- `json()`: Formats logs as JSON (easier to parse)

**Usage:**
```typescript
// In your code:
logger.info('Patient created', { patientId: '123', userId: 'abc' });
logger.error('Failed to create patient', { error: err.message });
logger.debug('Database query', { query: 'SELECT * FROM patients' });
```

### File 3: First Entity - Patient

**Why?** Entities represent our core business objects.

```typescript
// src/domain/entities/Patient.ts

export class Patient {
  constructor(
    public readonly id: string,
    public name: string,
    public age: number,
    public sex: 'Male' | 'Female' | 'Other',
    public mobile: string,
    public diagnosis?: string,
    public tags: string[] = [],
    public readonly createdAt: Date = new Date()
  ) {
    // Validate on creation
    this.validate();
  }

  // Business validation rules
  private validate(): void {
    // Age validation
    if (this.age < 0 || this.age > 150) {
      throw new Error('Age must be between 0 and 150');
    }

    // Name validation
    if (!this.name || this.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    // Mobile validation (Bangladesh format)
    if (!this.isValidMobile(this.mobile)) {
      throw new Error('Invalid mobile number format');
    }
  }

  private isValidMobile(mobile: string): boolean {
    // Bangladesh mobile: +8801XXXXXXXXX or 01XXXXXXXXX
    const regex = /^(\+8801|8801|01)[3-9]\d{8}$/;
    return regex.test(mobile);
  }

  // Business methods
  public updateDiagnosis(diagnosis: string): void {
    this.diagnosis = diagnosis;
    // Could add audit log here
  }

  public addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  public removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  public isAdult(): boolean {
    return this.age >= 18;
  }

  // Convert to JSON for API response
  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      sex: this.sex,
      mobile: this.mobile,
      diagnosis: this.diagnosis,
      tags: this.tags,
      createdAt: this.createdAt,
      isAdult: this.isAdult()
    };
  }
}
```

**Explanation:**

1. **Why a class?**
   - Encapsulates data and behavior together
   - Can have validation logic
   - Can have business methods
   - Type-safe

2. **Why `readonly`?**
   - `id` and `createdAt` should never change after creation
   - TypeScript prevents accidental modification

3. **Why `validate()` in constructor?**
   - Ensures we never have invalid Patient objects
   - Fail fast - catch errors early

4. **Business methods:**
   - `addTag()` - Business logic: no duplicate tags
   - `updateDiagnosis()` - Business logic: could log audit trail
   - `isAdult()` - Business logic: age-based logic

**Usage:**
```typescript
// Create a patient
const patient = new Patient(
  'uuid-123',
  'John Doe',
  35,
  'Male',
  '01712345678'
);

// Use business methods
patient.addTag('diabetes');
patient.addTag('hypertension');
patient.updateDiagnosis('Type 2 Diabetes');

// Check business rules
if (patient.isAdult()) {
  // Adult-specific logic
}

// Convert to JSON for API
const json = patient.toJSON();
```

---

## Understanding the Flow

Let's trace a request from start to finish:

```
1. HTTP Request comes in
   POST /api/patients
   Body: { name: "John", age: 35, sex: "Male", mobile: "01712345678" }
   ↓

2. Hits Middleware Layer
   - Authentication middleware checks JWT token
   - Validation middleware validates input
   ↓

3. Reaches Controller
   - PatientController.create()
   - Extracts data from request
   - Calls Use Case
   ↓

4. Executes Use Case
   - CreatePatientUseCase.execute()
   - Business logic runs here
   - Calls Repository
   ↓

5. Repository Interacts with Database
   - PrismaPatientRepository.save()
   - Saves to PostgreSQL
   ↓

6. Returns up the chain
   Repository → Use Case → Controller
   ↓

7. HTTP Response sent
   Status: 201 Created
   Body: { success: true, data: { patient } }
```

**Example Code Flow:**

```typescript
// 1. Request hits route
app.post('/api/patients', authMiddleware, patientController.create);

// 2. authMiddleware validates JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const user = verifyToken(token);
  req.user = user;
  next();
};

// 3. Controller receives request
class PatientController {
  async create(req, res) {
    const dto = req.body;
    const userId = req.user.id;
    
    // Call use case
    const patient = await this.createPatientUseCase.execute(dto, userId);
    
    res.status(201).json({ success: true, data: patient });
  }
}

// 4. Use Case executes business logic
class CreatePatientUseCase {
  async execute(dto, userId) {
    // Validate
    this.validate(dto);
    
    // Check duplicates
    const existing = await this.repo.findByMobile(dto.mobile, userId);
    if (existing) throw new Error('Already exists');
    
    // Create entity
    const patient = new Patient(
      uuid(),
      dto.name,
      dto.age,
      dto.sex,
      dto.mobile
    );
    
    // Save via repository
    return await this.repo.save(patient, userId);
  }
}

// 5. Repository saves to database
class PrismaPatientRepository {
  async save(patient, userId) {
    return await prisma.patient.create({
      data: {
        id: patient.id,
        userId: userId,
        name: patient.name,
        age: patient.age,
        sex: patient.sex,
        mobile: patient.mobile
      }
    });
  }
}
```

---

## Why Each Layer?

### Why Entities?
```typescript
// Without Entity ❌
const patient = {
  name: "X",
  age: -50,  // Invalid! But no validation
  mobile: "abc"  // Invalid! But no validation
};

// With Entity ✅
const patient = new Patient(
  id,
  "X",
  -50,  // Throws error immediately!
  "Male",
  "abc"  // Throws error immediately!
);
```

### Why Use Cases?
```typescript
// Without Use Case ❌
// Business logic scattered in controllers
app.post('/patients', async (req, res) => {
  // Validation here
  // Duplicate check here
  // Save here
  // Email notification here
  // Messy!
});

// With Use Case ✅
// Business logic centralized
class CreatePatientUseCase {
  async execute(dto) {
    // All business logic in one place
    // Easy to test
    // Easy to reuse (HTTP, CLI, Cron job)
  }
}
```

### Why Repositories?
```typescript
// Without Repository ❌
// Direct database calls everywhere
await prisma.patient.create({ data });
await prisma.patient.findMany({ where });

// If you change to MongoDB later:
// Change 100+ files! 😱

// With Repository ✅
interface IPatientRepository {
  save(patient);
  findById(id);
}

// Change database? Just change repository implementation!
// 1 file to change! 😊
```

---

## Next Steps

Ami ekhon implementation continue korbo step by step:

1. ✅ Created project structure
2. ✅ Explained architecture
3. ✅ Created first entity (Patient)
4. ✅ Created errors & logger
5. 📝 Next: Repository interfaces
6. 📝 Next: Use cases
7. 📝 Next: Controllers

**Apnar kono question ache?**
- Architecture bujhte parchen?
- Kono part explain korte hobe?
- Implementation continue korbo?

Let me know, and I'll continue building! 🚀