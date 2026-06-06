import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'

import { EmployeeDashboard } from './pages/employee/EmployeeDashboard'
import { MyTasks } from './pages/employee/MyTasks'
import { MyPnL } from './pages/employee/MyPnL'
import { Gamification } from './pages/employee/Gamification'

import { ManagerDashboard } from './pages/manager/ManagerDashboard'
import { TaskManagement } from './pages/manager/TaskManagement'
import { ConsequenceEngine } from './pages/manager/ConsequenceEngine'
import { RetentionRisk } from './pages/manager/RetentionRisk'
import { TeamProfitability } from './pages/manager/TeamProfitability'
import { PeerRatings } from './pages/manager/PeerRatings'

import { CFODashboard } from './pages/cfo/CFODashboard'
import { OrgAnalytics } from './pages/cfo/OrgAnalytics'
import { Simulator } from './pages/cfo/Simulator'
import { RetentionStats } from './pages/cfo/RetentionStats'

export default function App() {
  return (
    <BrowserRouter basename="/HR-New-Features">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/employee/dashboard" replace />} />

          <Route path="employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="employee/tasks" element={<MyTasks />} />
          <Route path="employee/pnl" element={<MyPnL />} />
          <Route path="employee/gamification" element={<Gamification />} />

          <Route path="manager/dashboard" element={<ManagerDashboard />} />
          <Route path="manager/tasks" element={<TaskManagement />} />
          <Route path="manager/consequences" element={<ConsequenceEngine />} />
          <Route path="manager/retention" element={<RetentionRisk />} />
          <Route path="manager/profitability" element={<TeamProfitability />} />
          <Route path="manager/peer-ratings" element={<PeerRatings />} />

          <Route path="cfo/dashboard" element={<CFODashboard />} />
          <Route path="cfo/analytics" element={<OrgAnalytics />} />
          <Route path="cfo/simulator" element={<Simulator />} />
          <Route path="cfo/retention" element={<RetentionStats />} />

          <Route path="*" element={<div className="text-center py-20 text-gray-500">404 — Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
