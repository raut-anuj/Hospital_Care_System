import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/admin", exact: true },
  { name: "Doctors", path: "/admin/doctors" },
  { name: "Patients", path: "/admin/patients" },
  // { name: "Appointments", path: "/admin/appointments" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen 
      bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 
      text-white shadow-2xl flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <NavLink
        to="/admin"
        end
        className="p-5 border-b border-white/10 block 
          hover:bg-white/10 dark:hover:bg-gray-700 transition"
      >
        <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
        <p className="text-xs text-white/60 dark:text-gray-400 mt-1">
          Hospital Management System
        </p>
      </NavLink>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.exact || false}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
              ${isActive 
                ? "bg-white/20 dark:bg-gray-600" 
                : "hover:bg-white/10 dark:hover:bg-gray-700"}`
            }
          >
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-white/50 dark:text-gray-400">
        © 2026 Hospital Admin
      </div>
    </aside>
  );
}
