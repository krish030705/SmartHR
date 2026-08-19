import { Router } from 'express'
import {
  listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, listManagers,
} from '../controllers/employeeController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(protect, authorize('admin'))

router.get('/', asyncHandler(listEmployees))
router.post('/', asyncHandler(createEmployee))
router.get('/managers', asyncHandler(listManagers))
router.get('/:id', asyncHandler(getEmployee))
router.put('/:id', asyncHandler(updateEmployee))
router.delete('/:id', asyncHandler(deleteEmployee))

export default router