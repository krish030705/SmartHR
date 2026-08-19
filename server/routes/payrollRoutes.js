import { Router } from 'express'
import {
  generatePayroll, listPayroll, myPayroll, updatePayroll,
} from '../controllers/payrollController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(protect)

router.post('/generate', authorize('admin'), asyncHandler(generatePayroll))
router.get('/', authorize('admin'), asyncHandler(listPayroll))
router.get('/me', authorize('employee'), asyncHandler(myPayroll))
router.put('/:id', authorize('admin'), asyncHandler(updatePayroll))

export default router