import React from "react";
import { useQuery } from "@tanstack/react-query";
import "../../styles/PatientMedicalRecords.css";
import API_URL from "../../api/api.js";
import Toast from "../../components/Toast.jsx";
import { FileText, Calendar, User, Download, Stethoscope } from "lucide-react";

export default function PatientMedicalRecords() {
  const token = localStorage.getItem("token");

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["patient-medical-records"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/patient/medicalRecords`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to fetch medical records");
      }
      return json?.data || [];
    },
  });

  return (
    <div className="medical-records-page">
      <div className="medical-records-header">
        <h2 className="medical-records-title">My Medical Records</h2>
        <p className="medical-records-subtitle">
          View your past diagnoses and download prescriptions.
        </p>
      </div>

      <div className="medical-records-timeline">
        {isLoading ? (
          <div className="medical-records-loading">Loading records...</div>
        ) : records.length > 0 ? (
          records.map((record) => (
            <div key={record._id} className="medical-record-card">
              <div className="medical-record-header">
                <div className="medical-record-date">
                  <Calendar size={18} className="mr-icon" />
                  <span>
                    {new Date(record.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="medical-record-doctor">
                  <User size={18} className="mr-icon" />
                  <span>Dr. {record.doctorId?.name || "Unknown"}</span>
                  {record.doctorId?.specialization && (
                    <span className="mr-spec">({record.doctorId.specialization})</span>
                  )}
                </div>
              </div>

              <div className="medical-record-body">
                <div className="medical-record-diagnosis">
                  <Stethoscope size={20} className="mr-icon-primary" />
                  <div>
                    <h4>Diagnosis</h4>
                    <p>{record.diagnosedWith}</p>
                  </div>
                </div>

                <div className="medical-record-notes">
                  <FileText size={20} className="mr-icon-secondary" />
                  <div>
                    <h4>Doctor's Notes</h4>
                    <p>{record.notes || "No additional notes."}</p>
                  </div>
                </div>
              </div>

              {record.prescriptionFile && (
                <div className="medical-record-footer">
                  <a
                    href={record.prescriptionFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="medical-record-download-btn"
                  >
                    <Download size={18} />
                    View / Download Prescription
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="medical-records-empty">
            <div className="medical-records-empty-icon">📁</div>
            <h3>No Medical Records Found</h3>
            <p>You don't have any medical records yet. Records will appear here after your consultation is completed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
