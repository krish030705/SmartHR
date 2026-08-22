import User from '../models/User.js'
import { signToken } from '../utils/jwt.js'

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  }
}

export async function login(req, res) {
  const { email, password, role } = req.body

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required.' })
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const passwordMatches = await user.comparePassword(password)
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  if (user.role !== role) {
    return res.status(403).json({ message: `This account is not registered as ${role}.` })
  }

  const token = signToken(user)
  res.json({ token, user: publicUser(user) })
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) })
}

export async function register(req, res) {
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required.' })
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() })
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' })
  }

  const user = await User.create({ name, email, password, role })
  const token = signToken(user)
  res.status(201).json({ token, user: publicUser(user) })
}

/**
 * PUT /api/auth/change-password
 * Body: { currentPassword, newPassword }
 *
 * currentPassword is required UNLESS the user is on the forced first-login
 * flow (mustChangePassword: true) — in that case they already proved they
 * know the temp password by logging in moments ago, so we don't re-ask.
 */
export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' })
  }

  const user = await User.findById(req.user._id).select('+password')

  if (!user.mustChangePassword) {
    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required.' })
    }
    const matches = await user.comparePassword(currentPassword)
    if (!matches) {
      return res.status(401).json({ message: 'Current password is incorrect.' })
    }
  }

  user.password = newPassword
  user.mustChangePassword = false
  await user.save()

  res.json({ message: 'Password updated successfully.' })
}