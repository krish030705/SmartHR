import { Router } from 'express'
import {
  checkIn, checkOut, myAttendance, listAttendance, teamAttendance,
} from '../controllers/attendanceController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(protect)

router.post('/check-in', authorize('employee'), asyncHandler(checkIn))
router.post('/check-out', authorize('employee'), asyncHandler(checkOut))
router.get('/me', authorize('employee'), asyncHandler(myAttendance))
router.get('/team', authorize('manager'), asyncHandler(teamAttendance))
router.get('/', authorize('admin'), asyncHandler(listAttendance))

export default router