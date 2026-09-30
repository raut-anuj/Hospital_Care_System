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

  const [medicalRecordModal, setMedicalRecordModal] = useState({
    isOpen: false,
    appointmentId: null,
    patientId: null,
    date: null
  });
  const [medicalRecordForm, setMedicalRecordForm] = useState({
    diagnosedWith: "",
    notes: "",
    prescriptionFile: null
  });
  const [isSubmittingRecord, setIsSubmittingRecord] = useState(false);

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

  const handleCompleteClick = (appointment) => {
    setMedicalRecordModal({
      isOpen: true,
      appointmentId: appointment._id,
      patientId: appointment.patientId?._id,
      date: appointment.date
    });
    setMedicalRecordForm({ diagnosedWith: "", notes: "", prescriptionFile: null });
    setOpenMenuId(null);
  };

  const handleMedicalRecordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingRecord(true);
    
    try {
      const formData = new FormData();
      formData.append("patientId", medicalRecordModal.patientId);
      formData.append("diagnosedWith", medicalRecordForm.diagnosedWith);
      formData.append("notes", medicalRecordForm.notes);
      formData.append("date", medicalRecordModal.date);
      if (medicalRecordForm.prescriptionFile) {
        formData.append("prescriptionFile", medicalRecordForm.prescriptionFile);
      }

      // Create medical record
      const recordRes = await fetch(`${API_URL}/api/v1/doctor/medicalRecord`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const recordData = await recordRes.json();

      if (!recordRes.ok) {
        throw new Error(recordData?.message || "Failed to create medical record");
      }

      // Update appointment status to completed
      await handleStatusUpdate(medicalRecordModal.appointmentId, "completed");
      
      setMedicalRecordModal({ isOpen: false, appointmentId: null, patientId: null, date: null });
      showToast("Medical record saved and appointment completed", "success");

    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to save medical record", "error");
    } finally {
      setIsSubmittingRecord(false);
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
                              onClick={() => handleCompleteClick(a)}
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

      {/* Medical Record Modal */}
      {medicalRecordModal.isOpen && (
        <div className="patient-drawer-overlay" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="medical-record-modal" style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1e293b' }}>Complete Appointment</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Please fill in the medical record details to complete this appointment.</p>
            
            <form onSubmit={handleMedicalRecordSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#334155' }}>Diagnosis</label>
                <input
                  type="text"
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  placeholder="e.g. Viral Fever"
                  value={medicalRecordForm.diagnosedWith}
                  onChange={(e) => setMedicalRecordForm({...medicalRecordForm, diagnosedWith: e.target.value})}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#334155' }}>Doctor's Notes</label>
                <textarea
                  required
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', resize: 'vertical' }}
                  placeholder="Prescription details, rest advised, etc."
                  value={medicalRecordForm.notes}
                  onChange={(e) => setMedicalRecordForm({...medicalRecordForm, notes: e.target.value})}
                ></textarea>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#334155' }}>Prescription File (PDF/Image)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  style={{ width: '100%', padding: '0.5rem' }}
                  onChange={(e) => setMedicalRecordForm({...medicalRecordForm, prescriptionFile: e.target.files[0]})}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setMedicalRecordModal({ isOpen: false, appointmentId: null, patientId: null, date: null })}
                  style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                  disabled={isSubmittingRecord}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.75rem 1.5rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                  disabled={isSubmittingRecord}
                >
                  {isSubmittingRecord ? 'Saving...' : 'Save & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
