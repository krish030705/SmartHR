import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import User from './models/User.js'
import Department from './models/Department.js'

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

async function seed() {
  await connectDB()

  for (const demo of DEMO_USERS) {
    const existing = await User.findOne({ email: demo.email })

    if (existing) {
      console.log(`Updating existing user: ${demo.email}`)

      existing.name = demo.name
      existing.password = demo.password
      existing.role = demo.role
      existing.isActive = true

      await existing.save()

      console.log(`Updated: ${demo.email} / ${demo.password} (${demo.role})`)
    } else {
      await User.create(demo)

      console.log(
        `Created: ${demo.email} / ${demo.password} (${demo.role})`
      )
    }
  }

  for (const name of DEFAULT_DEPARTMENTS) {
    const existing = await Department.findOne({ name })

    if (existing) {
      console.log(`Skipped (already exists): department ${name}`)
      continue
    }

    await Department.create({ name })

    console.log(`Created department: ${name}`)
  }

  await mongoose.disconnect()

  console.log('Seeding complete.')
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message)
  process.exit(1)
})
