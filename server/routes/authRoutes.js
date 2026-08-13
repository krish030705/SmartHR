import { Router } from 'express'
import { login, me, register, changePassword } from '../controllers/authController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.post('/login', asyncHandler(login))
router.get('/me', protect, asyncHandler(me))
router.put('/change-password', protect, asyncHandler(changePassword))
router.post('/register', protect, authorize('admin'), asyncHandler(register))

export default router