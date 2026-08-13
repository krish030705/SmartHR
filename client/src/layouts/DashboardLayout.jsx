import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'

export default function DashboardLayout({ role, title, children }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col">
        <Navbar title={title} />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  )
}