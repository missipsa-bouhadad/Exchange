import SideBar from '../components/SideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <div className='flex'>
        <SideBar/>
        <div className="felx-1">
            <Outlet/>
        </div>
    </div>
  )
}

export default Dashboard