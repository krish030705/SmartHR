import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import HolidayList from '../../components/holidays/HolidayList.jsx'

export default function EmployeeHolidays() {
  return (
    <DashboardLayout role="employee" title="Holidays">
      <HolidayList />
    </DashboardLayout>
  )
}