import { Router } from 'express'
import { getAdminStats } from '../controllers/dashboardController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/admin-stats', protect, authorize('admin'), asyncHandler(getAdminStats))

export default router