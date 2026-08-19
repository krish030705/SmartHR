import mongoose from 'mongoose'

const payrollSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: String, required: true }, // "YYYY-MM"
    basicSalary: { type: Number, required: true, min: 0 },
    allowances: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    netSalary: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid'],
      default: 'Unpaid',
    },
  },
  { timestamps: true },
)

// One payroll record per employee per month.
payrollSchema.index({ employee: 1, month: 1 }, { unique: true })

export default mongoose.model('Payroll', payrollSchema)