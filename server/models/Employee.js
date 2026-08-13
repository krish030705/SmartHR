import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: [true, 'Name is required'], trim: true },
    photoUrl: { type: String, default: '' },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9+\-\s()]{7,15}$/, 'Enter a valid phone number'],
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date },
    address: { type: String, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: [true, 'Department is required'] },
    position: { type: String, required: [true, 'Position is required'], trim: true },
    joiningDate: { type: Date, required: [true, 'Joining date is required'] },
    employmentStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'On Leave', 'Terminated'],
      default: 'Active',
    },
    salary: { type: Number, required: [true, 'Salary is required'], min: [0, 'Salary cannot be negative'] },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    // Links this employee record to their login account — created
    // automatically whenever an employee is added (see employeeController).
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

export default mongoose.model('Employee', employeeSchema)