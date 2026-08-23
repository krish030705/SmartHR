import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import User from './models/User.js'
import Department from './models/Department.js'
import Employee from './models/Employee.js'

dotenv.config()

const DEMO_USERS = [
  {
    name: 'Priya Sharma',
    email: 'admin@smarthr.test',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'Arjun Mehta',
    email: 'manager@smarthr.test',
    password: 'Manager@123',
    role: 'manager',
  },
  {
    name: 'Kavya Reddy',
    email: 'employee@smarthr.test',
    password: 'Employee@123',
    role: 'employee',
  },
]

const DEFAULT_DEPARTMENTS = [
  'IT',
  'HR',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
]

async function upsertUser(demo) {
  const existing = await User.findOne({ email: demo.email })

  if (existing) {
    existing.name = demo.name
    existing.password = demo.password
    existing.role = demo.role
    existing.isActive = true
    await existing.save()
    console.log(`Updated user: ${demo.email} / ${demo.password} (${demo.role})`)
    return existing
  }

  const created = await User.create(demo)
  console.log(`Created user: ${demo.email} / ${demo.password} (${demo.role})`)
  return created
}

async function upsertEmployee({ employeeId, user, department, position, salary, manager = null }) {
  const existing = await Employee.findOne({ user: user._id })

  const payload = {
    employeeId,
    name: user.name,
    email: user.email,
    phone: '9999999999',
    department: department._id,
    position,
    joiningDate: new Date('2024-01-01'),
    employmentStatus: 'Active',
    salary,
    manager,
    user: user._id,
  }

  if (existing) {
    Object.assign(existing, payload)
    await existing.save()
    console.log(`Updated employee profile for ${user.email}`)
    return existing
  }

  const created = await Employee.create(payload)
  console.log(`Created employee profile for ${user.email}`)
  return created
}

async function seed() {
  await connectDB()

  // Departments first — employees reference them.
  const departmentDocs = {}
  for (const name of DEFAULT_DEPARTMENTS) {
    let dept = await Department.findOne({ name })
    if (!dept) {
      dept = await Department.create({ name })
      console.log(`Created department: ${name}`)
    } else {
      console.log(`Skipped (already exists): department ${name}`)
    }
    departmentDocs[name] = dept
  }

  // Users next.
  const [adminUser, managerUser, employeeUser] = await Promise.all(
    DEMO_USERS.map(upsertUser),
  )

  // Employee profiles for manager and employee — admin doesn't need one.
  const managerEmployee = await upsertEmployee({
    employeeId: 'EMP-DEMO-MGR',
    user: managerUser,
    department: departmentDocs.IT,
    position: 'Engineering Manager',
    salary: 350000,
  })

  await upsertEmployee({
    employeeId: 'EMP-DEMO-EMP',
    user: employeeUser,
    department: departmentDocs.IT,
    position: 'Software Engineer',
    salary: 250000,
    manager: managerEmployee._id,
  })

  await mongoose.disconnect()
  console.log('Seeding complete.')
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message)
  process.exit(1)
})