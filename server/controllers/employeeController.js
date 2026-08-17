import Employee from '../models/Employee.js'
import Department from '../models/Department.js'
import User from '../models/User.js'
import { generateTempPassword } from '../utils/generatePassword.js'

async function nextEmployeeId() {
  const count = await Employee.countDocuments()
  return `EMP-${String(count + 1).padStart(4, '0')}`
}

function validateEmployeePayload(body, { isUpdate = false } = {}) {
  const errors = {}
  const required = (field, label) => {
    if (!isUpdate && !body[field]) errors[field] = `${label} is required.`
  }

  required('name', 'Name')
  required('email', 'Email')
  required('phone', 'Phone number')
  required('department', 'Department')
  required('position', 'Position')
  required('joiningDate', 'Joining date')

  if (body.email && !/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (body.phone && !/^[0-9+\-\s()]{7,15}$/.test(body.phone)) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (body.salary !== undefined && body.salary !== '' && Number(body.salary) < 0) {
    errors.salary = 'Salary cannot be negative.'
  } else if (!isUpdate && (body.salary === undefined || body.salary === '')) {
    errors.salary = 'Salary is required.'
  }

  return errors
}

export async function listEmployees(req, res) {
  const {
    search = '', department, status, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10,
  } = req.query

  const filter = {}
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
    ]
  }
  if (department) filter.department = department
  if (status) filter.employmentStatus = status

  const pageNum = Math.max(1, Number(page))
  const limitNum = Math.min(50, Math.max(1, Number(limit)))

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate('department', 'name')
      .populate('manager', 'name employeeId')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Employee.countDocuments(filter),
  ])

  res.json({
    employees,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    },
  })
}

export async function getEmployee(req, res) {
  const employee = await Employee.findById(req.params.id)
    .populate('department', 'name')
    .populate('manager', 'name employeeId')

  if (!employee) return res.status(404).json({ message: 'Employee not found.' })
  res.json({ employee })
}

export async function createEmployee(req, res) {
  const errors = validateEmployeePayload(req.body)
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors })
  }

  const department = await Department.findById(req.body.department)
  if (!department) {
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors: { department: 'Select a valid department.' } })
  }

  const existingUser = await User.findOne({ email: req.body.email.toLowerCase().trim() })
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' })
  }

  const tempPassword = generateTempPassword()
const role = req.body.role === 'manager' ? 'manager' : 'employee'

const user = await User.create({
  name: req.body.name,
  email: req.body.email,
  password: tempPassword,
  role,
  mustChangePassword: true,
})

  try {
    const employee = await Employee.create({
      ...req.body,
      employeeId: await nextEmployeeId(),
      user: user._id,
    })
    const populated = await employee.populate('department', 'name')
    res.status(201).json({ employee: populated, tempPassword })
  } catch (err) {
    // Roll back the account we just created so we don't leave an
    // orphaned login with no employee record behind it.
    await User.findByIdAndDelete(user._id)
    throw err
  }
}

export async function updateEmployee(req, res) {
  const errors = validateEmployeePayload(req.body, { isUpdate: true })
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors })
  }

  const employee = await Employee.findById(req.params.id)
  if (!employee) return res.status(404).json({ message: 'Employee not found.' })

  Object.assign(employee, req.body)
  await employee.save()

  if (req.body.name || req.body.email) {
    await User.findByIdAndUpdate(employee.user, {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.email && { email: req.body.email }),
    })
  }

  const populated = await employee.populate('department', 'name')
  res.json({ employee: populated })
}

export async function deleteEmployee(req, res) {
  const employee = await Employee.findById(req.params.id)
  if (!employee) return res.status(404).json({ message: 'Employee not found.' })

  await Employee.findByIdAndDelete(req.params.id)
  // Deactivate rather than hard-delete the login account.
  await User.findByIdAndUpdate(employee.user, { isActive: false })

  res.json({ message: 'Employee removed.' })
}