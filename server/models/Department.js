import mongoose from 'mongoose'

// Minimal for now — just enough for Employees to reference a department
// and for the Add/Edit Employee form's dropdown. Full Departments
// management (add/edit/delete, employee counts) arrives in Phase 9.
const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Department', departmentSchema)