import React from 'react'
import { NavLink } from 'react-router-dom'

function SideBar() {
  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-[200px] md:w-[250px] bg-gray-900 text-white shadow-lg flex flex-col py-6">
      <NavLink
        to="/dashboard/profile"
        className={({ isActive }) =>
          `px-6 py-3 hover:bg-gray-700 transition-colors ${
            isActive ? "bg-gray-800 font-semibold" : ""
          }`
        }
      >
        Profile
      </NavLink>

      <NavLink
        to="/dashboard/ads"
        className={({ isActive }) =>
          `px-6 py-3 hover:bg-gray-700 transition-colors ${
            isActive ? "bg-gray-800 font-semibold" : ""
          }`
        }
      >
        Mes annonces
      </NavLink>

      <NavLink
        to="/dashboard/demandes"
        className={({ isActive }) =>
          `px-6 py-3 hover:bg-gray-700 transition-colors ${
            isActive ? "bg-gray-800 font-semibold" : ""
          }`
        }
      >
        Messages
      </NavLink>

      <NavLink
        to="/dashboard/requests"
        className={({ isActive }) =>
          `px-6 py-3 hover:bg-gray-700 transition-colors ${
            isActive ? "bg-gray-800 font-semibold" : ""
          }`
        }
      >
        Demandes d'échange
      </NavLink>

      
    </div>
  );
}

export default SideBar
