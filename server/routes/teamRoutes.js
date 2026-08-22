import { Router } from 'express'
import { myTeam } from '../controllers/employeeController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', protect, authorize('manager'), asyncHandler(myTeam))

export default router