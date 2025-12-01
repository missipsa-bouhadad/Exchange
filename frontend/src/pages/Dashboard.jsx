import SideBar from '../components/SideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="flex flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      <SideBar />
      <div className="flex-1 ml-[200px] md:ml-[250px] p-6">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
