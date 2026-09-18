import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "../../styles/AppointmentList.css";
import API_URL from "../../api/api.js";
import Toast from "../../components/Toast.jsx";

export default function AppointmentList() {
  const queryClient = useQueryClient();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [activeTab, setActiveTab] = useState("scheduled");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [toast, setToast] = useState(null);

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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".appointment-list-page__actions")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/doctor/updateAppointmentStatus`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
        showToast(`Appointment marked as ${newStatus}`, "success");
      } else {
        showToast(data?.message || "Failed to update appointment status", "error");
      }
    } catch (err) {
      console.error("Status update error: ", err);
      showToast("Server error during update", "error");
    } finally {
      setOpenMenuId(null);
    }
  };

  const filteredAppointments = appointments
    .filter((a) => {
      if (activeTab === "all") return true;
      return (a.status || "").toLowerCase() === activeTab;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="appointment-list-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="appointment-list-page__header">
        <h2 className="appointment-list-page__title">Patient Appointment List</h2>

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

      <div className="appointment-list-page__table-wrap">
        <table className="appointment-list-page__table">
          <thead className="appointment-list-page__thead">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th className="appointment-list-page__th-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              [1, 2].map((skeletonRow) => (
                <tr key={`appointment-skeleton-${skeletonRow}`} className="appointment-list-page__row">
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton table-skeleton--status" /></td>
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                </tr>
              ))
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((a, index) => (
                <tr key={a._id} className="appointment-list-page__row">
                  <td>{index + 1}</td>
                  <td>
                    <button
                      type="button"
                      className="patient-name-link"
                      onClick={() => setSelectedPatient(a.patientId)}
                      title="Click to view patient details"
                    >
                      {a.patientId?.name || "N/A"}
                    </button>
                  </td>
                  <td>{new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td>{a.time || "N/A"}</td>
                  <td>
                    <span className={`appointment-list-page__status appointment-list-page__status--${a.status || "default"}`}>
                      {(a.status || "UNKNOWN").toUpperCase()}
                    </span>
                  </td>
                  <td className="appointment-list-page__actions">
                    {a.status === "scheduled" && (
                      <>
                        <button
                          type="button"
                          className="appointment-dots-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === a._id ? null : a._id);
                          }}
                          aria-label="Actions"
                          title="Actions"
                        >
                          &#8942;
                        </button>

                        {openMenuId === a._id && (
                          <div className={`appointment-actions-dropdown ${
                            filteredAppointments.length > 2 && index >= filteredAppointments.length - 2
                              ? "appointment-actions-dropdown--up"
                              : ""
                          }`}>
                            <button
                              type="button"
                              className="appointment-action-item appointment-action-item--complete"
                              onClick={() => handleStatusUpdate(a._id, "completed")}
                            >
                              Complete
                            </button>
                            <button
                              type="button"
                              className="appointment-action-item appointment-action-item--cancel"
                              onClick={() => handleStatusUpdate(a._id, "cancelled")}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="appointment-list-page__empty">
                  No {activeTab} appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedPatient && (
        <div className="patient-drawer-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="patient-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="patient-drawer__header">
              <h3>Patient Details</h3>
              <button
                type="button"
                className="patient-drawer__close"
                onClick={() => setSelectedPatient(null)}
              >
                &times;
              </button>
            </div>

            <div className="patient-drawer__content">
              <div className="patient-drawer__avatar">
                {(selectedPatient?.name || "P").charAt(0).toUpperCase()}
              </div>
              <h4 className="patient-drawer__name">{selectedPatient?.name || "N/A"}</h4>

              <div className="patient-drawer__info-grid">
                <div className="patient-drawer__info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">{selectedPatient?.age || "N/A"} yrs</span>
                </div>
                <div className="patient-drawer__info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{selectedPatient?.gender || "N/A"}</span>
                </div>
                <div className="patient-drawer__info-item">
                  <span className="info-label">Blood Group</span>
                  <span className="info-value">{selectedPatient?.bloodgroup || "N/A"}</span>
                </div>
                <div className="patient-drawer__info-item patient-drawer__info-item--full">
                  <span className="info-label">Email</span>
                  <span className="info-value">{selectedPatient?.email || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
