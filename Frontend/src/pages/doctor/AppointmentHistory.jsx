import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "../../styles/AppointmentList.css";
import "../../styles/AppointmentHistory.css";
import API_URL from "../../api/api.js";

export default function AppointmentHistory() {
  const [activeTab, setActiveTab] = useState("completed");
  const token = localStorage.getItem("token");

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

  const appointmentHistory = appointments
    .filter((a) => {
      if (activeTab === "all") return true;
      return (a.status || "").toLowerCase() === activeTab;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="appointment-history-page">
      <div className="appointment-history-page__header">
        <h2 className="appointment-history-page__title">Appointment History</h2>

        <div className="appointment-status-tabs">
          <button
            className={`status-tab ${activeTab === "scheduled" ? "status-tab--active" : ""}`}
            onClick={() => setActiveTab("scheduled")}
          >
            Scheduled
          </button>
          <button
            className={`status-tab ${activeTab === "completed" ? "status-tab--active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={`status-tab ${activeTab === "cancelled" ? "status-tab--active" : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled
          </button>
          <button
            className={`status-tab ${activeTab === "all" ? "status-tab--active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
        </div>
      </div>

      <div className="appointment-history-page__table-wrap">
        <table className="appointment-history-page__table">
          <thead className="appointment-history-page__thead">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              [1, 2].map((skeletonRow) => (
                <tr key={`history-skeleton-${skeletonRow}`} className="appointment-history-page__row">
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton table-skeleton--status" /></td>
                </tr>
              ))
            ) : appointmentHistory.length > 0 ? (
              appointmentHistory.map((a, index) => (
                <tr key={a._id} className="appointment-history-page__row">
                  <td>{index + 1}</td>
                  <td>{a.patientId?.name || "N/A"}</td>
                  <td>{new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td>{a.time || "N/A"}</td>
                  <td>
                    <span className={`appointment-history-page__status appointment-history-page__status--${a.status || "default"}`}>
                      {(a.status || "UNKNOWN").toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="appointment-history-page__empty">
                  No completed or cancelled appointments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
