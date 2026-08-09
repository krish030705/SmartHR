import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.warn(
      'MONGODB_URI is not set — skipping DB connection. Copy server/.env.example to server/.env and fill it in.',
    )
    return
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  }
}
