import { Router } from 'express'
import { listNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js'
import { protect } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(protect)

router.get('/', asyncHandler(listNotifications))
router.put('/read-all', asyncHandler(markAllAsRead))
router.put('/:id/read', asyncHandler(markAsRead))

export default router