import { Router } from 'express'
import { login, me, register } from '../controllers/authController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.post('/login', asyncHandler(login))
router.get('/me', protect, asyncHandler(me))

// Not a public signup route — only an authenticated Admin can create new
// accounts (called from the Employee-management UI in Phase 7).
router.post('/register', protect, authorize('admin'), asyncHandler(register))

export default router