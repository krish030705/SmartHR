import { Router } from 'express'
import {
  listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee,
} from '../controllers/employeeController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// All employee management is Admin/HR-only in this phase. Manager gets a
// scoped, view-only version in Phase 12 (own controller, own route).
router.use(protect, authorize('admin'))

router.get('/', asyncHandler(listEmployees))
router.post('/', asyncHandler(createEmployee))
router.get('/:id', asyncHandler(getEmployee))
router.put('/:id', asyncHandler(updateEmployee))
router.delete('/:id', asyncHandler(deleteEmployee))

export default router