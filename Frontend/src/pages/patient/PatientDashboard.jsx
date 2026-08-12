import React from "react";
import "../../styles/PatientDashboard.css";

export default function PatientDashboard() {
  return (
    <div className="patient-dashboard-page">
      <h2 className="patient-dashboard-page__title">Patient Dashboard</h2>

      <div className="patient-dashboard-page__welcome">
        <h3>Welcome, Anuj Kumar</h3>
        <p>Age: 25 | Patient ID: #P12345</p>
      </div>

      <div className="patient-dashboard-page__stats">
        <div className="patient-dashboard-page__stat">
          <h3>Upcoming Appointments</h3>
          <p className="patient-dashboard-page__stat--blue">2</p>
        </div>
        <div className="patient-dashboard-page__stat">
          <h3>Prescriptions</h3>
          <p className="patient-dashboard-page__stat--green">5</p>
        </div>
        <div className="patient-dashboard-page__stat">
          <h3>Reports</h3>
          <p className="patient-dashboard-page__stat--purple">3</p>
        </div>
        <div className="patient-dashboard-page__stat">
          <h3>Billing</h3>
          <p className="patient-dashboard-page__stat--red">₹1200</p>
        </div>
      </div>

      <div className="patient-dashboard-page__panel patient-dashboard-page__panel--table">
        <h3>Upcoming Appointments</h3>
        <table className="patient-dashboard-page__table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dr. Raju</td>
              <td>24 Apr 2026</td>
              <td>10:00 AM</td>
              <td><span className="patient-dashboard-page__badge">Scheduled</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="patient-dashboard-page__panel">
        <h3>Prescriptions</h3>
        <ul>
          <li>Paracetamol 500mg — Twice daily</li>
          <li>Vitamin D — Once daily</li>
        </ul>
      </div>

      <div className="patient-dashboard-page__panel">
        <h3>Recent Reports</h3>
        <ul>
          <li>Blood Test — Normal</li>
          <li>X-Ray — Pending Review</li>
        </ul>
      </div>
    </div>
  );
}

