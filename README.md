# Hospital Total Operation Management System (HTOMS)

A comprehensive hospital management system built with modern web technologies.

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and build
- **Tailwind CSS** for styling
- **Axios** for HTTP requests

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Passport** - Authentication middleware

## Project Structure

```
Hospital-Total-Operation-Management-System/
├── frontend/                    # React + Vite + TypeScript application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── vite.config.ts          # Vite configuration
│   └── package.json
│
├── backend/                     # NestJS application
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── users/          # Users management
│   │   │   ├── departments/    # Departments management
│   │   │   ├── patients/       # Patients management
│   │   │   └── schedule/       # Schedule management
│   │   ├── prisma/             # Prisma service & module
│   │   ├── app.module.ts       # Root module
│   │   └── main.ts             # Application entry point
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── .env.example            # Environment variables template
│   ├── .env                    # Environment variables (local)
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml          # Docker services (PostgreSQL)
└── README.md                   # This file
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Docker (optional, for PostgreSQL)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Start PostgreSQL using Docker Compose (optional):**
   ```bash
   docker-compose up -d
   ```

5. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

6. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

7. **Start the backend server:**
   ```bash
   npm run start:dev
   ```

   Backend will be available at: `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:5173`

## Available Scripts

### Backend
- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start with debugging
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:cov` - Run tests with coverage
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

### Backend (.env)
```
BACKEND_PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/htoms_db
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

## Database Schema

The Prisma schema includes the following models:

- **User** - System users (Doctors, Nurses, Admin, Staff)
- **Department** - Hospital departments
- **Patient** - Patient information
- **Schedule** - User schedules

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Departments
- `GET /departments` - Get all departments
- `GET /departments/:id` - Get department by ID
- `POST /departments` - Create department
- `PATCH /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department

### Patients
- `GET /patients` - Get all patients
- `GET /patients/:id` - Get patient by ID
- `POST /patients` - Create patient
- `PATCH /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient

### Schedule
- `GET /schedule` - Get all schedules
- `GET /schedule/:id` - Get schedule by ID
- `POST /schedule` - Create schedule
- `PATCH /schedule/:id` - Update schedule
- `DELETE /schedule/:id` - Delete schedule

## Contributing

Please ensure code follows the project's ESLint and Prettier configuration.

## License

MIT
