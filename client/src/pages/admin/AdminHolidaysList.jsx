import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Button from '../../components/Button.jsx'
import HolidayList from '../../components/holidays/HolidayList.jsx'
import HolidayFormModal from '../../components/holidays/HolidayFormModal.jsx'

export default function AdminHolidaysList() {
  const [formOpen, setFormOpen] = useState(false)
  const [editHoliday, setEditHoliday] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleAdd() {
    setEditHoliday(null)
    setFormOpen(true)
  }

  function handleEdit(holiday) {
    setEditHoliday(holiday)
    setFormOpen(true)
  }

  function handleSaved() {
    setRefreshKey((k) => k + 1)
  }

  return (
    <DashboardLayout role="admin" title="Holidays">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={handleAdd} className="w-auto px-5">
            Add Holiday
          </Button>
        </div>

        <HolidayList key={refreshKey} canManage onEdit={handleEdit} />
      </div>

      <HolidayFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        holiday={editHoliday}
        onSaved={handleSaved}
      />
    </DashboardLayout>
  )
}