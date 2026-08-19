import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'leave' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }, // createdAt used as the notification timestamp
)

export default mongoose.model('Notification', notificationSchema)