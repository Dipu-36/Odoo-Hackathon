# HRMS – Human Resource Management System

Hackathon project. Monorepo with a **Next.js** frontend and a **NestJS** backend.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + React 19 + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui |
| State / Forms | TanStack Query v5 + React Hook Form + Zod |
| Backend | NestJS + TypeScript |
| Auth | JWT + Refresh Tokens + bcrypt |
| Authorization | RBAC – Admin / HR / Employee |
| Database | PostgreSQL + Prisma ORM |
| Storage | Cloudinary (profile pictures & documents) |

## Project Structure

```
Odoo-Hackathon/
├── frontend/                   # Next.js App Router
│   ├── app/
│   │   ├── (auth)/             # login, signup, verify
│   │   └── (dashboard)/
│   │       ├── admin/          # employees, attendance, leave, payroll
│   │       └── employee/       # profile, attendance, leave, payroll
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── attendance/
│   │   ├── leave/
│   │   └── payroll/
│   ├── lib/
│   │   ├── api/                # axios client + per-module API functions
│   │   └── hooks/              # TanStack Query hooks
│   ├── types/                  # shared TypeScript types
│   └── middleware.ts           # JWT-based route protection
│
└── backend/                    # NestJS REST API
    ├── src/
    │   ├── auth/
    │   ├── users/
    │   ├── profiles/
    │   ├── attendance/
    │   ├── leave/
    │   ├── payroll/
    │   ├── common/             # guards, decorators, filters
    │   └── prisma/             # PrismaService (global)
    └── prisma/
        └── schema.prisma       # PostgreSQL schema
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL running locally (or update `DATABASE_URL`)

### 1 – Backend

```bash
cd backend
npm install
# Edit .env with your DB credentials
npx prisma migrate dev --name init
npm run start:dev
```

API docs available at `http://localhost:3001/api/docs`

### 2 – Frontend

```bash
cd frontend
npm install
# shadcn/ui components (add as needed)
npx shadcn@latest add button input label card badge
npm run dev
```

App available at `http://localhost:3000`

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Sign up |
| `/api/auth/verify` | GET | Email verification |
| `/api/auth/login` | POST | Sign in |
| `/api/profiles/me` | GET / PATCH | My profile |
| `/api/attendance/check-in` | POST | Check in |
| `/api/attendance/check-out` | POST | Check out |
| `/api/attendance` | GET | View attendance |
| `/api/leave` | POST / GET | Submit / list leaves |
| `/api/leave/:id` | PATCH | Approve/reject (Admin) |
| `/api/payroll/me` | GET | My payslip (Employee) |
| `/api/payroll/:employeeId` | GET / PATCH | Manage payroll (Admin) |
