import React from "react";
import {
  CalendarDays,
  Pill,
  FileText,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import "../../styles/PatientDashboard.css";
import API_URL from "../../api/api.js";
import { useQuery } from "@tanstack/react-query";

export default function PatientDashboard() {
  const [patientName, setPatientName] = React.useState("Patient");
  const [patientAge, setPatientAge] = React.useState("");
  const token = localStorage.getItem("token");

  // ── Profile ───────────────────────────────────────────────────────────────
  const profileQuery = useQuery({
    queryKey: ["patient-profile"],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/patient/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result?.message || "Failed to fetch patient profile");
      return result?.data;
    },
  });

  // ── Appointments (React Query) ────────────────────────────────────────────
  const appointmentsQuery = useQuery({
    queryKey: ["patient-appointments"],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/v1/patient/getAppointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result?.message || "Failed to fetch appointments"
        );
      return Array.isArray(result?.data) ? result.data : [];
    },
  });

  // ── Bills (React Query) ───────────────────────────────────────────────────
  const billsQuery = useQuery({
    queryKey: ["patient-bills"],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/patient/myBills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result?.message || "Failed to fetch bills");
      return Array.isArray(result?.data) ? result.data : [];
    },
  });

  // ── Sync profile into state ───────────────────────────────────────────────
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.name) setPatientName(user.name);
        if (user?.age !== undefined && user?.age !== null)
          setPatientAge(user.age);
      } catch (error) {
        console.error("Failed to read patient name:", error);
      }
    }
  }, []);

  React.useEffect(() => {
    if (profileQuery.data?.name) setPatientName(profileQuery.data.name);
    if (
      profileQuery.data?.age !== undefined &&
      profileQuery.data?.age !== null
    )
      setPatientAge(profileQuery.data.age);
  }, [profileQuery.data]);

  // ── Derived values ────────────────────────────────────────────────────────
  const allAppointments = appointmentsQuery.data ?? [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = allAppointments
    .filter((a) => a.status === "scheduled" && new Date(a.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcomingCount = upcomingAppointments.length;
  const upcomingAppointment = upcomingAppointments[0] ?? null;

  const bills = billsQuery.data ?? [];
  const pendingBillTotal = bills.reduce(
    (sum, b) => sum + ((b.totalAmount ?? 0) - (b.paidAmount ?? 0)),
    0
  );

  return (
    <div className="patient-dashboard-page">
      <div className="patient-dashboard-header">
        <div>
          <h2 className="patient-dashboard-page__title">Patient Dashboard</h2>
          <p className="patient-dashboard-page__subtitle">
            Welcome to your health overview and appointments
          </p>
        </div>
      </div>

      {/* Welcome Banner Card */}
      <div className="patient-dashboard-page__welcome">
        <div className="patient-welcome-avatar">
          <User size={24} />
        </div>
        <div className="patient-welcome-info">
          <h3>Welcome, {patientName}</h3>
          <div className="patient-welcome-badges">
            {profileQuery.isLoading ? (
              <span
                className="patient-badge patient-age-skeleton"
                aria-label="Loading age"
              />
            ) : (
              <span className="patient-badge">Age: {patientAge}</span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="patient-dashboard-page__stats">
        {/* Appointments – live from API */}
        <div className="patient-dashboard-page__stat">
          <span className="patient-stat-tag">Appointments</span>
          <p className="patient-stat-value">
            {appointmentsQuery.isLoading ? "…" : upcomingCount}
          </p>
          <span className="patient-stat-subtext">Upcoming visits</span>
        </div>

        {/* Prescriptions – heading only */}
        <div className="patient-dashboard-page__stat">
          <span className="patient-stat-tag">Prescriptions</span>
        </div>

        {/* Reports – heading only */}
        <div className="patient-dashboard-page__stat">
          <span className="patient-stat-tag">Reports</span>
        </div>

        {/* Billing – live from API */}
        <div className="patient-dashboard-page__stat">
          <span className="patient-stat-tag">Billing</span>
          <p className="patient-stat-value">
            {billsQuery.isLoading ? "…" : `₹${pendingBillTotal}`}
          </p>
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
              {upcomingAppointment ? (
                <tr>
                  <td>
                    <div className="patient-doctor-cell">
                      <div className="patient-doctor-avatar">
                        {(upcomingAppointment.doctorId?.name || "DR")
                          .replace(/^Dr\.\s*/i, "")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <strong>
                          {upcomingAppointment.doctorId?.name || "Doctor"}
                        </strong>
                        <span className="patient-doctor-spec">
                          {upcomingAppointment.doctorId?.specialization ||
                            "Doctor Appointment"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {new Date(upcomingAppointment.date).toLocaleDateString(
                      "en-IN",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )}
                  </td>
                  <td>
                    <span className="patient-time-badge">
                      <Clock size={13} />{" "}
                      {upcomingAppointment.time || "Not specified"}
                    </span>
                  </td>
                  <td>
                    <span className="patient-dashboard-page__badge">
                      {upcomingAppointment.status}
                    </span>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4">No upcoming appointments</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column Section: Prescriptions & Recent Reports */}
      <div className="patient-details-grid">
        <div className="patient-dashboard-page__panel">
          <div className="patient-panel-header">
            <div className="patient-panel-title-wrap">
              <Pill
                size={18}
                className="patient-panel-icon patient-panel-icon--green"
              />
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
              <FileText
                size={18}
                className="patient-panel-icon patient-panel-icon--purple"
              />
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
