import Department from '../models/Department.js'
import Employee from '../models/Employee.js'

/**
 * GET /api/departments
 * Includes employeeCount per department.
 */
export async function listDepartments(_req, res) {
  const departments = await Department.find().sort({ name: 1 }).lean()
  const counts = await Employee.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
  ])
  const countByDept = Object.fromEntries(counts.map((c) => [String(c._id), c.count]))

  res.json({
    departments: departments.map((d) => ({
      ...d,
      employeeCount: countByDept[String(d._id)] || 0,
    })),
  })
}

export async function createDepartment(req, res) {
  const { name } = req.body
  if (!name?.trim()) {
    return res.status(400).json({ message: 'Department name is required.' })
  }

  const existing = await Department.findOne({ name: name.trim() })
  if (existing) {
    return res.status(409).json({ message: 'A department with this name already exists.' })
  }

  const department = await Department.create({ name: name.trim() })
  res.status(201).json({ department })
}

export async function updateDepartment(req, res) {
  const { name } = req.body
  if (!name?.trim()) {
    return res.status(400).json({ message: 'Department name is required.' })
  }

  const department = await Department.findById(req.params.id)
  if (!department) {
    return res.status(404).json({ message: 'Department not found.' })
  }

  const existing = await Department.findOne({ name: name.trim(), _id: { $ne: department._id } })
  if (existing) {
    return res.status(409).json({ message: 'A department with this name already exists.' })
  }

  department.name = name.trim()
  await department.save()
  res.json({ department })
}

/**
 * DELETE /api/departments/:id
 * Blocked if any employee still belongs to this department.
 */
export async function deleteDepartment(req, res) {
  const department = await Department.findById(req.params.id)
  if (!department) {
    return res.status(404).json({ message: 'Department not found.' })
  }

  const employeeCount = await Employee.countDocuments({ department: department._id })
  if (employeeCount > 0) {
    return res.status(409).json({
      message: `Can't delete — ${employeeCount} employee${employeeCount === 1 ? ' is' : 's are'} still assigned to this department. Reassign them first.`,
    })
  }

  await department.deleteOne()
  res.json({ message: 'Department removed.' })
}