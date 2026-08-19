import { Router } from 'express'
import {
  listHolidays, createHoliday, updateHoliday, deleteHoliday,
} from '../controllers/holidayController.js'
import { protect, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(protect)

router.get('/', asyncHandler(listHolidays))
router.post('/', authorize('admin'), asyncHandler(createHoliday))
router.put('/:id', authorize('admin'), asyncHandler(updateHoliday))
router.delete('/:id', authorize('admin'), asyncHandler(deleteHoliday))

export default router