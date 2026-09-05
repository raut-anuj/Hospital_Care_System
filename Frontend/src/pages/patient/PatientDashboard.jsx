import React from "react";
import {
  CalendarDays,
  Pill,
  FileText,
  CreditCard,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
} from "lucide-react";
import "../../styles/PatientDashboard.css";

export default function PatientDashboard() {
  return (
    <div className="patient-dashboard-page">
      <div className="patient-dashboard-header">
        <div>
          <h2 className="patient-dashboard-page__title">Patient Dashboard</h2>
          <p className="patient-dashboard-page__subtitle">
            Welcome to your health overview and appointments
          </p>
        </div>
        <div className="patient-dashboard-status-pill">
          <span className="patient-status-dot" />
          <span>Active Patient</span>
        </div>
      </div>

      {/* Welcome Banner Card */}
      <div className="patient-dashboard-page__welcome">
        <div className="patient-welcome-avatar">
          <User size={24} />
        </div>
        <div className="patient-welcome-info">
          <h3>Welcome, Anuj Kumar</h3>
          <div className="patient-welcome-badges">
            <span className="patient-badge">Age: 25</span>
            <span className="patient-badge">Patient ID: #P12345</span>
            <span className="patient-badge patient-badge--health">
              <Activity size={13} /> Health Status: Stable
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="patient-dashboard-page__stats">
        <div className="patient-dashboard-page__stat patient-stat--blue">
          <div className="patient-stat-top">
            <div className="patient-stat-icon patient-stat-icon--blue">
              <CalendarDays size={20} />
            </div>
            <span className="patient-stat-tag">Appointments</span>
          </div>
          <p className="patient-stat-value patient-dashboard-page__stat--blue">2</p>
          <span className="patient-stat-subtext">Upcoming visits</span>
        </div>

        <div className="patient-dashboard-page__stat patient-stat--green">
          <div className="patient-stat-top">
            <div className="patient-stat-icon patient-stat-icon--green">
              <Pill size={20} />
            </div>
            <span className="patient-stat-tag">Prescriptions</span>
          </div>
          <p className="patient-stat-value patient-dashboard-page__stat--green">5</p>
          <span className="patient-stat-subtext">Active medications</span>
        </div>

        <div className="patient-dashboard-page__stat patient-stat--purple">
          <div className="patient-stat-top">
            <div className="patient-stat-icon patient-stat-icon--purple">
              <FileText size={20} />
            </div>
            <span className="patient-stat-tag">Reports</span>
          </div>
          <p className="patient-stat-value patient-dashboard-page__stat--purple">3</p>
          <span className="patient-stat-subtext">Lab & radiology</span>
        </div>

        <div className="patient-dashboard-page__stat patient-stat--red">
          <div className="patient-stat-top">
            <div className="patient-stat-icon patient-stat-icon--red">
              <CreditCard size={20} />
            </div>
            <span className="patient-stat-tag">Billing</span>
          </div>
          <p className="patient-stat-value patient-dashboard-page__stat--red">₹1200</p>
          <span className="patient-stat-subtext">Pending payment</span>
        </div>
      </div>

      {/* Upcoming Appointments Table */}
      <div className="patient-dashboard-page__panel patient-dashboard-page__panel--table">
        <div className="patient-panel-header">
          <div className="patient-panel-title-wrap">
            <CalendarDays size={18} className="patient-panel-icon" />
            <h3>Upcoming Appointments</h3>
          </div>
        </div>
        <div className="patient-table-scroll">
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
                <td>
                  <div className="patient-doctor-cell">
                    <div className="patient-doctor-avatar">DR</div>
                    <div>
                      <strong>Dr. Raju</strong>
                      <span className="patient-doctor-spec">General Physician</span>
                    </div>
                  </div>
                </td>
                <td>24 Apr 2026</td>
                <td>
                  <span className="patient-time-badge">
                    <Clock size={13} /> 10:00 AM
                  </span>
                </td>
                <td>
                  <span className="patient-dashboard-page__badge">
                    Scheduled
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column Section: Prescriptions & Recent Reports */}
      <div className="patient-details-grid">
        <div className="patient-dashboard-page__panel">
          <div className="patient-panel-header">
            <div className="patient-panel-title-wrap">
              <Pill size={18} className="patient-panel-icon patient-panel-icon--green" />
              <h3>Prescriptions</h3>
            </div>
          </div>
          <ul className="patient-item-list">
            <li className="patient-item-card">
              <div className="patient-item-icon patient-item-icon--green">
                <Pill size={16} />
              </div>
              <div className="patient-item-content">
                <strong>Paracetamol 500mg</strong>
                <span>Twice daily • After meals</span>
              </div>
            </li>
            <li className="patient-item-card">
              <div className="patient-item-icon patient-item-icon--green">
                <Pill size={16} />
              </div>
              <div className="patient-item-content">
                <strong>Vitamin D3</strong>
                <span>Once daily • Morning</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="patient-dashboard-page__panel">
          <div className="patient-panel-header">
            <div className="patient-panel-title-wrap">
              <FileText size={18} className="patient-panel-icon patient-panel-icon--purple" />
              <h3>Recent Reports</h3>
            </div>
          </div>
          <ul className="patient-item-list">
            <li className="patient-item-card">
              <div className="patient-item-icon patient-item-icon--purple">
                <FileText size={16} />
              </div>
              <div className="patient-item-content">
                <strong>Blood Test (CBC)</strong>
                <span className="patient-report-badge patient-report-badge--normal">
                  <CheckCircle2 size={12} /> Normal
                </span>
              </div>
            </li>
            <li className="patient-item-card">
              <div className="patient-item-icon patient-item-icon--purple">
                <FileText size={16} />
              </div>
              <div className="patient-item-content">
                <strong>Chest X-Ray</strong>
                <span className="patient-report-badge patient-report-badge--pending">
                  <AlertCircle size={12} /> Pending Review
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
