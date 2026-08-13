import Department from '../models/Department.js'

// List-only for now. Full CRUD lands in Phase 9.
export async function listDepartments(_req, res) {
  const departments = await Department.find().sort({ name: 1 })
  res.json({ departments })
}