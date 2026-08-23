/**
 * One-time script to bootstrap the first Admin account.
 * Run this once, locally, before using the app for the first time —
 * there's no other way to create the very first Admin, since the normal
 * "register" endpoint requires an existing Admin token to use.
 *
 * Usage:
 *   node scripts/createAdmin.js "Admin Name" admin@example.com yourpassword
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'

dotenv.config()

async function run() {
  const [name, email, password] = process.argv.slice(2)

  if (!name || !email || !password) {
    console.error('Usage: node scripts/createAdmin.js "Admin Name" admin@example.com yourpassword')
    process.exit(1)
  }

  await connectDB()

  const existing = await User.findOne({ email: email.toLowerCase().trim() })
  if (existing) {
    console.error(`A user with email ${email} already exists.`)
    await mongoose.disconnect()
    process.exit(1)
  }

  await User.create({
    name,
    email,
    password,
    role: 'admin',
    mustChangePassword: false,
  })

  console.log(`Admin account created: ${email}`)
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})