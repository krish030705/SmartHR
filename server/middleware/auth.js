import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'

export async function protect(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. Please sign in.' })
  }

  try {
    const token = header.split(' ')[1]
    const decoded = verifyToken(token)
    const user = await User.findById(decoded.id)

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Not authorized. Please sign in.' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Session expired. Please sign in again.' })
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have access to this resource.' })
    }
    next()
  }
}