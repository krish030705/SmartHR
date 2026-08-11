import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import User from './models/User.js'

dotenv.config()

// Demo credentials for testing each portal — clearly seed data.
const DEMO_USERS = [
  { name: 'Priya Sharma', email: 'admin@smarthr.test', password: 'Admin@123', role: 'admin' },
  { name: 'Arjun Mehta', email: 'manager@smarthr.test', password: 'Manager@123', role: 'manager' },
  { name: 'Kavya Reddy', email: 'employee@smarthr.test', password: 'Employee@123', role: 'employee' },
]

async function seed() {
  await connectDB()

  for (const demo of DEMO_USERS) {
    const existing = await User.findOne({ email: demo.email })
    if (existing) {
      console.log(`Skipped (already exists): ${demo.email}`)
      continue
    }
    await User.create(demo)
    console.log(`Created: ${demo.email} / ${demo.password} (${demo.role})`)
  }

  await mongoose.disconnect()
  console.log('Seeding complete.')
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message)
  process.exit(1)
})