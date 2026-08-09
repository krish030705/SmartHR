import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Health check — useful for confirming the server + DB connection are up
// before wiring real routes on top of it.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'smarthr-server' })
})

// Route modules are added here one module at a time, matching the build
// order in the README (auth → employees → departments → attendance → ...).

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`SmartHR server running on port ${PORT}`)
  })
}

start()
