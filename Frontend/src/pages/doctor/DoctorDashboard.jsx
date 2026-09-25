import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import "../../styles/DoctorDashboard.css";
import API_URL from "../../api/api.js";

export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState("Doctor");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.name) setDoctorName(user.name);
      } catch (error) {
        console.error("Failed to read doctor name:", error);
      }
    }
  }, []);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["doctor-appointments"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/doctor/getAllAppointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch appointments");
      return data?.data || [];
    },
  });

  const uniquePatientsCount = useMemo(() =>
    new Set(appointments.map((a) => a.patientId?._id || a.patientId).filter(Boolean)).size,
    [appointments]
  );

  const scheduledCount = useMemo(() =>
    appointments.filter((a) => (a.status || "").toLowerCase() === "scheduled").length,
    [appointments]
  );

  const completedCount = useMemo(() =>
    appointments.filter((a) => (a.status || "").toLowerCase() === "completed").length,
    [appointments]
  );

  const cancelledCount = useMemo(() =>
    appointments.filter((a) => (a.status || "").toLowerCase() === "cancelled").length,
    [appointments]
  );

  const total = appointments.length;

  const recentAppointments = useMemo(() =>
    [...appointments]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5),
    [appointments]
  );

  const todayAppointments = useMemo(() =>
    appointments
      .filter((a) => new Date(a.date).toDateString() === new Date().toDateString())
      .sort((a, b) => (a.time || "").localeCompare(b.time || "")),
    [appointments]
  );

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = [
    { label: "Total Patients",  sublabel: "Unique patients assigned",  value: uniquePatientsCount, color: "blue" },
    { label: "Scheduled",       sublabel: "Upcoming appointments",      value: scheduledCount,      color: "green" },
    { label: "Completed",       sublabel: "Consultations done",         value: completedCount,      color: "purple" },
    { label: "Cancelled",       sublabel: "Appointments cancelled",     value: cancelledCount,      color: "red" },
  ];

  return (
    <div className="doctor-dashboard">

      {/* Header */}
      <div className="doctor-dashboard__header">
        <div>
          <p className="doctor-dashboard__greeting">{greeting()},</p>
          <h2 className="doctor-dashboard__title">{doctorName}</h2>
        </div>
        <div className="doctor-dashboard__date">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="doctor-dashboard__stats">
        {stats.map((s) => (
          <div key={s.label} className={`doctor-dashboard__card doctor-dashboard__card--${s.color}`}>
            <h3>{s.label}</h3>
            <p className={`doctor-dashboard__value doctor-dashboard__value--${s.color}`}>
              {isLoading ? "-" : s.value}
            </p>
            <span>{s.sublabel}</span>
          </div>
        ))}
      </div>

      {/* Bottom Row: Workload + Table | Today's Schedule */}
      <div className="doctor-dashboard__row">

        {/* Left Panel: Workload + Recent Appointments */}
        <div className="doctor-dashboard__panel">
          <div className="doctor-dashboard__panel-header">
            <h3 className="doctor-dashboard__panel-title">Appointment Workload</h3>
            <span className="doctor-dashboard__panel-badge">{total} Total</span>
          </div>

          {/* Stacked bar */}
          <div className="doctor-dashboard__workload-bar">
            {total > 0 ? (
              <>
                <div className="doctor-dashboard__bar-seg doctor-dashboard__bar-seg--scheduled"
                  style={{ width: `${(scheduledCount / total) * 100}%` }}
                  title={`Scheduled: ${scheduledCount}`} />
                <div className="doctor-dashboard__bar-seg doctor-dashboard__bar-seg--completed"
                  style={{ width: `${(completedCount / total) * 100}%` }}
                  title={`Completed: ${completedCount}`} />
                <div className="doctor-dashboard__bar-seg doctor-dashboard__bar-seg--cancelled"
                  style={{ width: `${(cancelledCount / total) * 100}%` }}
                  title={`Cancelled: ${cancelledCount}`} />
              </>
            ) : (
              <div className="doctor-dashboard__bar-seg doctor-dashboard__bar-seg--empty" style={{ width: "100%" }} />
            )}
          </div>

          {/* Legend */}
          <div className="doctor-dashboard__legend">
            <div className="doctor-dashboard__legend-item">
              <span className="doctor-dashboard__legend-dot doctor-dashboard__legend-dot--scheduled" />
              <span>Scheduled: <strong>{scheduledCount}</strong></span>
            </div>
            <div className="doctor-dashboard__legend-item">
              <span className="doctor-dashboard__legend-dot doctor-dashboard__legend-dot--completed" />
              <span>Completed: <strong>{completedCount}</strong></span>
            </div>
            <div className="doctor-dashboard__legend-item">
              <span className="doctor-dashboard__legend-dot doctor-dashboard__legend-dot--cancelled" />
              <span>Cancelled: <strong>{cancelledCount}</strong></span>
            </div>
          </div>

          {/* Recent Appointments Table */}
          <div className="doctor-dashboard__table-wrap">
            <table className="doctor-dashboard__table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date &amp; Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td><span className="dd-skel dd-skel--md" /></td>
                      <td><span className="dd-skel dd-skel--sm" /></td>
                      <td><span className="dd-skel dd-skel--xs" /></td>
                      <td><span className="dd-skel dd-skel--pill" /></td>
                    </tr>
                  ))
                ) : recentAppointments.length > 0 ? (
                  recentAppointments.map((a) => (
                    <tr key={a._id}>
                      <td className="doctor-dashboard__table-bold">{a.patientId?.name || "Patient"}</td>
                      <td>
                        {a.date ? new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}{" "}
                        <span className="doctor-dashboard__table-time">{a.time || ""}</span>
                      </td>
                      <td>{a.amount != null ? `Rs.${a.amount}` : "-"}</td>
                      <td>
                        <span className={`status-pill status-pill--${a.status || "scheduled"}`}>
                          {a.status || "scheduled"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="doctor-dashboard__table-empty">No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Today's Schedule */}
        <div className="doctor-dashboard__side">
          <div className="doctor-dashboard__panel">
            <div className="doctor-dashboard__panel-header">
              <h3 className="doctor-dashboard__panel-title">Today's Schedule</h3>
              <span className="doctor-dashboard__panel-badge">{todayAppointments.length} Appts</span>
            </div>

            <div className="doctor-dashboard__today-list">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="doctor-dashboard__today-item">
                    <span className="dd-skel dd-skel--md" style={{ marginBottom: "0.25rem" }} />
                    <span className="dd-skel dd-skel--xs" />
                  </div>
                ))
              ) : todayAppointments.length === 0 ? (
                <p className="doctor-dashboard__today-empty">No appointments scheduled for today.</p>
              ) : (
                todayAppointments.map((a, i) => (
                  <div key={a._id} className="doctor-dashboard__today-item">
                    <div className="doctor-dashboard__today-left">
                      <span className="doctor-dashboard__today-num">{i + 1}</span>
                      <div>
                        <p className="doctor-dashboard__today-name">{a.patientId?.name || "Patient"}</p>
                        <p className="doctor-dashboard__today-time">{a.time || "-"}</p>
                      </div>
                    </div>
                    <span className={`status-pill status-pill--${a.status || "scheduled"}`}>
                      {a.status || "scheduled"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
