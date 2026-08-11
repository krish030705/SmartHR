import User from '../models/User.js'
import { signToken } from '../utils/jwt.js'

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

// POST /api/auth/login — role is checked against the account's actual
// role so an Employee account can't sign in through the Admin portal.
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

// GET /api/auth/me — confirms a stored token is still valid
export async function me(req, res) {
  res.json({ user: publicUser(req.user) })
}

// POST /api/auth/register — not exposed in the UI; used for seeding accounts
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