import { Router } from 'express'
import {
  applyLeave, myLeave, listLeave, teamLeave, approveLeave, rejectLeave,
} from '../controllers/leaveController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(protect)

router.post('/', authorize('employee'), asyncHandler(applyLeave))
router.get('/me', authorize('employee'), asyncHandler(myLeave))
router.get('/team', authorize('manager'), asyncHandler(teamLeave))
router.get('/', authorize('admin'), asyncHandler(listLeave))
router.put('/:id/approve', authorize('admin', 'manager'), asyncHandler(approveLeave))
router.put('/:id/reject', authorize('admin', 'manager'), asyncHandler(rejectLeave))

export default router