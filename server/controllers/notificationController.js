import Notification from '../models/Notification.js'

/**
 * GET /api/notifications
 * The logged-in user's own notifications, most recent first.
 */
export async function listNotifications(req, res) {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()

  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false })

  res.json({ notifications, unreadCount })
}

/**
 * PUT /api/notifications/:id/read
 */
export async function markAsRead(req, res) {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id })
  if (!notification) return res.status(404).json({ message: 'Notification not found.' })

  notification.isRead = true
  await notification.save()
  res.json({ notification })
}

/**
 * PUT /api/notifications/read-all
 */
export async function markAllAsRead(req, res) {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true })
  res.json({ message: 'All notifications marked as read.' })
}