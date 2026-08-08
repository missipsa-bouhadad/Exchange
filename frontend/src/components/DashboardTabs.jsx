import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/dashboard/profile", label: "Profile" },
  { to: "/dashboard/ads", label: "Mes annonces" },
  { to: "/dashboard/messages", label: "Messages" },
  { to: "/dashboard/requests", label: "Demandes d'échange" },
  { to: "/dashboard/sent-requests", label: "Demandes envoyées" },
  { to: "/dashboard/favorites", label: "Favoris" },
];

const DashboardTabs = () => {
  return (
    <div className="bg-mauve-clair border-b border-mauve-clair w-full">
      <nav className="flex items-stretch w-full overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              `flex-1 text-center px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? "text-mauve-fonce border-mauve-fonce bg-blanc"
                  : "text-mauve-fonce/70 border-transparent hover:text-mauve-fonce hover:bg-blanc/50"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default DashboardTabs;
