import React from "react";
import {
  CalendarDays,
  User,
  Clock,
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
      if (!response.ok) {
        if (response.status === 400 || response.status === 404) return [];
        throw new Error(
          result?.message || "Failed to fetch patient appointments"
        );
      }
      return result?.data || [];
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
      if (!response.ok) {
        if (response.status === 400 || response.status === 404) return [];
        throw new Error(result?.message || "Failed to fetch bills");
      }
      return (result?.data || []).filter((bill) => bill.appointmentId != null);
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
    if (profileQuery.data) {
      if (profileQuery.data.name) setPatientName(profileQuery.data.name);
      if (profileQuery.data.age !== undefined && profileQuery.data.age !== null)
        setPatientAge(profileQuery.data.age);
    }
  }, [profileQuery.data]);

  // ── Derived values ────────────────────────────────────────────────────────
  const appointmentsList = appointmentsQuery.data || [];
  const billsList = billsQuery.data || [];

  const upcomingCount = appointmentsList.filter(
    (app) => app.status !== "cancelled"
  ).length;

  const upcomingAppointment = appointmentsList.find(
    (app) => app.status !== "cancelled"
  );

  const unpaidInvoicesList = billsList.filter((bill) => bill.billStatus === "UNPAID");
  const unpaidInvoicesCount = unpaidInvoicesList.length;

  const pendingBillTotal = unpaidInvoicesList.reduce(
    (acc, bill) => acc + (bill.totalAmount || 0),
    0
  );

  // Generate real patient ID from MongoDB _id or fallback
  const patientId = profileQuery.data?._id
    ? `#PAT-${profileQuery.data._id.slice(-4).toUpperCase()}`
    : profileQuery.data?.id
    ? `#PAT-${profileQuery.data.id.slice(-4).toUpperCase()}`
    : "#PAT-8821";

  return (
    <div className="patient-dashboard-page">
      {/* Top Header */}
      <div className="patient-dashboard-header">
        <div>
          <h2 className="patient-dashboard-page__title">
            Welcome, {patientName}
          </h2>
          <p className="patient-dashboard-page__subtitle">
            Manage your appointments and healthcare activity
          </p>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="patient-dashboard-page__welcome">
        <div className="patient-welcome-avatar">
          <User size={24} />
        </div>
        <div className="patient-welcome-info">
          <h3>Welcome, {patientName}</h3>
          <div className="patient-welcome-badges">
            <span className="patient-badge">Patient ID: {patientId}</span>
            <span className="patient-badge">
              Age:{" "}
              {profileQuery.isLoading ? (
                <span className="patient-badge patient-age-skeleton"></span>
              ) : (
                patientAge || "N/A"
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Stat Cards */}
      <div className="patient-dashboard-page__stats">
        {/* Appointments – live from API */}
        <div className="patient-dashboard-page__stat">
          <span className="patient-stat-tag">Appointments</span>
          <p className="patient-stat-value">
            {appointmentsQuery.isLoading ? "…" : upcomingCount}
          </p>
          <span className="patient-stat-subtext">Upcoming visits</span>
        </div>

        {/* Unpaid Invoices – live from API */}
        <div className="patient-dashboard-page__stat">
          <span className="patient-stat-tag">Unpaid Invoices</span>
          <p className="patient-stat-value">
            {billsQuery.isLoading ? "…" : unpaidInvoicesCount}
          </p>
          <span className="patient-stat-subtext">Bills pending payment</span>
        </div>

        {/* Billing – live from API */}
        <div className="patient-dashboard-page__stat">
          <span className="patient-stat-tag">Billing</span>
          <p className="patient-stat-value">
            {billsQuery.isLoading ? "…" : `₹${pendingBillTotal}`}
          </p>
          <span className="patient-stat-subtext">Total pending amount</span>
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
    </div>
  );
}
