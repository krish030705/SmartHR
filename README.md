# SmartHR — Human Resource Management System

A full-stack HR Management System with role-based portals for Admin/HR, Managers, and Employees. Built as a portfolio project (MERN stack).

> **Status:** Phase 1 in progress — project scaffolding, shared UI components, and the three role-based login pages are done. Authentication, dashboards, and the rest of the modules are being built module by module (see Roadmap below).

## Features (planned, full scope)

- Role-based access for Admin/HR, Manager, and Employee
- Employee management (CRUD), profiles, and departments
- Attendance tracking and leave management with approval workflow
- Payroll/salary overview, company holidays, notifications
- JWT authentication with protected, role-restricted routes

## User Roles

| Role | Access |
|---|---|
| Admin / HR | Full access — employees, departments, attendance, leave, payroll, holidays, settings |
| Manager | Team-scoped — team attendance, team leave approvals, department view |
| Employee | Self-service — own profile, attendance, leave, salary, holidays |

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt password hashing

## Project Structure

```
SmartHR/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Reusable UI (Button, Input, LoadingSpinner, EmptyState, ...)
│       ├── layouts/       # Shared page shells (AuthLayout, ...)
│       ├── pages/         # Route-level pages, grouped by area (auth, ...)
│       ├── routes/        # Route definitions
│       ├── services/      # API client modules
│       └── utils/         # Validators and other shared helpers
└── server/          # Express + MongoDB backend
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    └── config/
```

## Getting Started

### Frontend

```bash
cd client
npm install
npm run dev
```

Runs at `http://localhost:5173`.

### Backend

```bash
cd server
cp .env.example .env   # then fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

Runs at `http://localhost:5000`. Health check: `GET /api/health`.

## Roadmap

- [x] Project scaffolding, shared layout, three role-based login pages
- [ ] Authentication (JWT, password hashing, protected routes)
- [ ] Role-based routing and guards
- [ ] Admin dashboard
- [ ] Employee management + profile
- [ ] Departments
- [ ] Attendance
- [ ] Leave management
- [ ] Manager dashboard
- [ ] Employee dashboard
- [ ] Payroll
- [ ] Holidays
- [ ] Notifications
- [ ] Settings
- [ ] Seed data, validation polish, error handling pass
- [ ] Responsive/testing pass
- [ ] GitHub push
