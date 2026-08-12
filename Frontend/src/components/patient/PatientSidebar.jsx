import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/PatientSidebar.css";

const menuItems = [
  { name: "Dashboard", path: "/patient", exact: true },
  { name: "Appointment", path: "/patient/appointment" },
];

export default function PatientSidebar() {
  return (
    <aside className="patient-sidebar">
      <NavLink to="/patient" end className="patient-sidebar__brand">
        <h2 className="patient-sidebar__title">Patient Panel</h2>
        <p className="patient-sidebar__subtitle">Hospital Care System</p>
      </NavLink>

      <nav className="patient-sidebar__nav">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.exact || false}
            className={({ isActive }) =>
              [
                "patient-sidebar__nav-item",
                isActive ? "patient-sidebar__nav-item--active" : "patient-sidebar__nav-item--inactive",
              ].join(" ")
            }
          >
            <span className="patient-sidebar__nav-label">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="patient-sidebar__footer">© 2026 Patient Portal</div>
    </aside>
  );
}
