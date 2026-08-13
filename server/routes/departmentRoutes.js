import { Router } from 'express'
import {
  listDepartments, createDepartment, updateDepartment, deleteDepartment,
} from '../controllers/departmentController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(protect, authorize('admin'))

router.get('/', asyncHandler(listDepartments))
router.post('/', asyncHandler(createDepartment))
router.put('/:id', asyncHandler(updateDepartment))
router.delete('/:id', asyncHandler(deleteDepartment))

export default router