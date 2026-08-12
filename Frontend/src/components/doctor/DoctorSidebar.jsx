import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/DoctorSidebar.css";

const menuItems = [
  { name: "Dashboard", path: "/doctor", exact: true },
  { name: "Appointment List", path: "/doctor/AppointmentList" },
  { name: "Schedule Appointment", path: "/doctor/ScheduleAppointment" },
];

export default function DoctorSidebar() {
  return (
    <aside className="doctor-sidebar">
      <NavLink to="/doctor" end className="doctor-sidebar__brand">
        <h2 className="doctor-sidebar__title">Doctor</h2>
        <p className="doctor-sidebar__subtitle">Hospital Care</p>
      </NavLink>

      <nav className="doctor-sidebar__nav">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.exact || false}
            className={({ isActive }) =>
              [
                "doctor-sidebar__nav-item",
                isActive ? "doctor-sidebar__nav-item--active" : "doctor-sidebar__nav-item--inactive",
              ].join(" ")
            }
          >
            <span className="doctor-sidebar__nav-label">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="doctor-sidebar__footer">© 2026 Hospital Admin</div>
    </aside>
  );
}
