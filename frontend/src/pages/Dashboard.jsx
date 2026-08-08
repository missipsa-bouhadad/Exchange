import React from 'react'
import { Outlet } from 'react-router-dom'
import DashboardTabs from '../components/DashboardTabs'

function Dashboard() {
  return (
    <div className="min-h-screen bg-blanc pt-16">
      <DashboardTabs />
      <div className="px-4 py-8">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
