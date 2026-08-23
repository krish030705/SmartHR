# SmartHR – Human Resource Management System

A full-stack HR management platform with role-based access for Admin/HR, Managers, and Employees — built as a portfolio project to demonstrate a complete MERN application with real authentication, authorization, and multi-role workflows.
<img width="1911" height="912" alt="login page" src="https://github.com/user-attachments/assets/d01a0c97-a612-4cd4-a292-b2e525015238" />


## Features

**Admin / HR**
- Dashboard with live employee/manager/department/pending-leave stats
- Employee management — search, filter, sort, paginate, add/edit/remove, auto-generated login accounts
- Employee profiles with tabbed detail view
- Department management with employee-count safeguards
- Attendance overview with date/status filters
- Leave approval queue
- Payroll — auto-generate monthly records from salary, edit allowances/deductions, mark paid
- Holiday calendar management
- Notification feed
  <img width="1917" height="897" alt="admin dashboard" src="https://github.com/user-attachments/assets/d81d393a-4659-436f-8473-ab1a828d30a9" />


**Manager**
- Team attendance and leave views, scoped to direct reports only
- Leave approval for direct reports (enforced server-side — a manager cannot act on another manager's team)
- "My Team" directory
<img width="1895" height="900" alt="manager dashboard" src="https://github.com/user-attachments/assets/f7bd23b5-e5d6-4a47-bf6d-6b8515ed67ce" />

**Employee**
- Self-service check-in / check-out with live status
- Apply for leave, track approval status
- View own attendance history and payslips
- Company holiday calendar (read-only)
- Notifications on leave approval/rejection
  <img width="1918" height="910" alt="employe dashboard" src="https://github.com/user-attachments/assets/70996c81-134e-4b83-a336-71cd41d72dab" />


**Cross-cutting**
- JWT authentication with bcrypt password hashing
- Forced password change on first login (temporary passwords)
- Role-based route protection on both frontend and backend
- Real-time notification bell (unread count, mark read/mark all read)

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS v4, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT, bcrypt

## Project Structure
SmartHR/
├── client/
│ ├── src/
│ │ ├── components/ # Reusable UI (Button, Input, Modal, Sidebar, Navbar, ...)
│ │ ├── context/ # AuthContext
│ │ ├── layouts/ # DashboardLayout
│ │ ├── pages/ # Route-level pages, organized by role
│ │ ├── routes/ # AppRoutes
│ │ ├── services/ # API client + one service module per feature
│ │ └── utils/ # Validators
│ └── package.json
│
├── server/
│ ├── config/ # DB connection
│ ├── controllers/ # Route handlers, one per feature
│ ├── middleware/ # auth (protect/authorize), error handling
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Express routers
│ ├── scripts/ # createAdmin.js (bootstrap script)
│ ├── utils/ # asyncHandler, jwt helpers
│ └── server.js
│
└── README.md

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone and install
```bash
git clone https://github.com/krish030705/SmartHR.git
cd SmartHR

cd server && npm install
cd ../client && npm install
```

### 2. Environment variables

PORT=5000
MONGODB_URI=mongodb+srv://krishhari030705:Hari%40003@cluster0.3hfoiri.mongodb.net/smarthr?appName=Cluster0
JWT_SECRET=replace_with_a_long_random_string65845
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api


### 3. Bootstrap the first Admin account

There's no public "sign up" — every account is created by an Admin from inside the app. That means the very first Admin has to be created directly, via a one-time script:

```bash
cd server
node scripts/createAdmin.js "Your Name" you@example.com yourpassword
```

### 4. Run the app

In one terminal:
```bash
cd server
npm run dev
```

In another terminal:
```bash
cd client
npm run dev
```

Visit `http://localhost:5173`, sign in as Admin/HR with the account you just created, and start adding employees and managers from the Employees page — each gets a temporary password shown once, which they'll be prompted to change on first login.

## API Overview

All endpoints are prefixed with `/api` and require a `Bearer` token (except `/auth/login`) via the `Authorization` header.

| Resource | Base path | Notes |
|---|---|---|
| Auth | `/auth` | login, me, register (admin-only), change-password |
| Employees | `/employees` | Admin-only CRUD, plus `/employees/managers` |
| Team | `/team` | Manager-only, own direct reports |
| Departments | `/departments` | Admin-only CRUD |
| Attendance | `/attendance` | Self check-in/out, admin/manager scoped views |
| Leave | `/leave` | Apply, view, approve/reject (admin + manager, team-scoped) |
| Payroll | `/payroll` | Generate, list, edit (admin), own payslips (employee) |
| Holidays | `/holidays` | View (all roles), write (admin-only) |
| Notifications | `/notifications` | Own notifications, mark read |

## Future Improvements

- File uploads for employee profile photos
- Email notifications alongside in-app ones
- Payroll PDF payslip export
- Audit log of admin actions
- Automated test suite (Jest/Supertest for the API, React Testing Library for the client)
