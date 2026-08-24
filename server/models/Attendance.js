import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true }, // normalized to midnight — one record per employee per day
    checkIn: { type: Date, default: null },
    checkOut: { type: Date, default: null },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Half Day', 'Leave'],
      default: 'Present',
    },
  },
  { timestamps: true },
)

// Prevents duplicate attendance records for the same employee on the same day.
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true })

export default mongoose.model('Attendance', attendanceSchema)