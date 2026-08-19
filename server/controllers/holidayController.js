import Holiday from '../models/Holiday.js'

/**
 * GET /api/holidays
 * Any authenticated role can view the holiday calendar.
 */
export async function listHolidays(_req, res) {
  const holidays = await Holiday.find().sort({ date: 1 }).lean()
  res.json({ holidays })
}

export async function createHoliday(req, res) {
  const { name, date } = req.body
  if (!name?.trim() || !date) {
    return res.status(400).json({ message: 'Holiday name and date are required.' })
  }

  const holiday = await Holiday.create({ name: name.trim(), date })
  res.status(201).json({ holiday })
}

export async function updateHoliday(req, res) {
  const { name, date } = req.body
  if (!name?.trim() || !date) {
    return res.status(400).json({ message: 'Holiday name and date are required.' })
  }

  const holiday = await Holiday.findById(req.params.id)
  if (!holiday) return res.status(404).json({ message: 'Holiday not found.' })

  holiday.name = name.trim()
  holiday.date = date
  await holiday.save()

  res.json({ holiday })
}

export async function deleteHoliday(req, res) {
  const holiday = await Holiday.findById(req.params.id)
  if (!holiday) return res.status(404).json({ message: 'Holiday not found.' })

  await holiday.deleteOne()
  res.json({ message: 'Holiday removed.' })
}