import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  { name: "Dashboard", path: "/admin", exact: true },
  { name: "Doctors", path: "/admin/doctors" },
  { name: "Patients", path: "/admin/patients" },
  // { name: "Appointments", path: "/admin/appointments" },
];

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <NavLink to="/admin" end className="admin-sidebar__brand">
        <h2 className="admin-sidebar__title">Admin Panel</h2>
        <p className="admin-sidebar__subtitle">Hospital Management System</p>
      </NavLink>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.exact || false}
            className={({ isActive }) =>
              [
                "admin-sidebar__nav-item",
                isActive ? "admin-sidebar__nav-item--active" : "admin-sidebar__nav-item--inactive",
              ].join(" ")
            }
          >
            <span className="admin-sidebar__nav-label">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">© 2026 Hospital Admin</div>
    </aside>
  );
}
