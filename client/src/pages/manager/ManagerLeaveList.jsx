import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import ManagerLeaveSection from './ManagerLeaveSection.jsx'

export default function ManagerLeaveList() {
  return (
    <DashboardLayout role="manager" title="Leave">
      <ManagerLeaveSection />
    </DashboardLayout>
  )
}