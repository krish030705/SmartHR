import { Router } from 'express'
import { listDepartments } from '../controllers/departmentController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', protect, authorize('admin'), asyncHandler(listDepartments))

export default router