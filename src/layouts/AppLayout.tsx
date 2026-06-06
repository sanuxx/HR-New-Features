import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Toast } from '../components/ui/Toast'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden">
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-bg-primary">
          <div className="p-5 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <Toast />
    </div>
  )
}
