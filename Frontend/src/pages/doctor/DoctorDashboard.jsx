import React from "react";
import "./DoctorDashboard.css";

export default function DoctorDashboard() {
  return (
    <div className="doctor-dashboard">
      <h2 className="doctor-dashboard__title">Welcome, Doctor</h2>

      <div className="doctor-dashboard__stats">
        <div className="doctor-dashboard__card">
          <h3>My Patients</h3>
          <p className="doctor-dashboard__value doctor-dashboard__value--blue">24</p>
          <span>Active cases</span>
        </div>

        <div className="doctor-dashboard__card">
          <h3>Appointments Today</h3>
          <p className="doctor-dashboard__value doctor-dashboard__value--green">6</p>
          <span>Next at 3 PM</span>
        </div>

        <div className="doctor-dashboard__card">
          <h3>Reports Pending</h3>
          <p className="doctor-dashboard__value doctor-dashboard__value--purple">3</p>
          <span>To be reviewed</span>
        </div>
      </div>

      <div className="doctor-dashboard__actions">
        <button className="doctor-dashboard__button doctor-dashboard__button--blue">Add Patient</button>
        <button className="doctor-dashboard__button doctor-dashboard__button--green">Schedule Appointment</button>
        <button className="doctor-dashboard__button doctor-dashboard__button--purple">Review Reports</button>
      </div>
    </div>
  );
}
