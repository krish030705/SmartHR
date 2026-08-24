import mongoose from 'mongoose'

const holidaySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Holiday name is required'], trim: true },
    date: { type: Date, required: [true, 'Date is required'] },
  },
  { timestamps: true },
)

export default mongoose.model('Holiday', holidaySchema)