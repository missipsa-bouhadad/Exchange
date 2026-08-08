import React from 'react'
import { NavLink } from 'react-router-dom'

function SideBar() {
  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-[200px] md:w-[250px] bg-mauve-clair text-mauve-fonce shadow-lg flex flex-col py-6 border-r border-mauve-clair">
      <NavLink
        to="/dashboard/profile"
        className={({ isActive }) =>
          `px-6 py-3 hover:bg-mauve-fonce hover:text-blanc transition-colors ${
            isActive ? "bg-mauve-fonce text-blanc font-semibold border-l-4 border-mauve-fonce" : ""
          }`
        }
      >
        Profile
      </NavLink>

      <NavLink
        to="/dashboard/ads"
        className={({ isActive }) =>
          `px-6 py-3 hover:bg-mauve-fonce hover:text-blanc transition-colors ${
            isActive ? "bg-mauve-fonce text-blanc font-semibold border-l-4 border-mauve-fonce" : ""
          }`
        }
      >
        Mes annonces
      </NavLink>

      <NavLink
        to="/dashboard/demandes"
        className={({ isActive }) =>
          `px-6 py-3 hover:bg-mauve-fonce hover:text-blanc transition-colors ${
            isActive ? "bg-mauve-fonce text-blanc font-semibold border-l-4 border-mauve-fonce" : ""
          }`
        }
      >
        Messages
      </NavLink>

      <NavLink
        to="/dashboard/requests"
        className={({ isActive }) =>
          `px-6 py-3 hover:bg-mauve-fonce hover:text-blanc transition-colors ${
            isActive ? "bg-mauve-fonce text-blanc font-semibold border-l-4 border-mauve-fonce" : ""
          }`
        }
      >
        Demandes d'échange
      </NavLink>

      <NavLink
        to="/dashboard/sent-requests"
        className={({ isActive }) =>
          `px-6 py-3 hover:bg-mauve-fonce hover:text-blanc transition-colors ${
            isActive ? "bg-mauve-fonce text-blanc font-semibold border-l-4 border-mauve-fonce" : ""
          }`
        }
      >
        Mes demandes envoyées
      </NavLink>


    </div>
  );
}

export default SideBar