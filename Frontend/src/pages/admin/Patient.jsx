import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "../../styles/Patient.css";
import API_URL from "../../api/api.js";

export default function Patients() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const token = localStorage.getItem("token");

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["admin-patients"],
    queryFn: async () => {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_URL}/api/v1/admin/patientsList`, {
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch patients");
      return data?.data || [];
    },
  });

  const filteredPatients = list
    .filter((doc) => doc.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="patient-page">
      <h2 className="patient-page__title">Patient List</h2>

      <input
        type="text"
        placeholder="Search patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="patient-page__search"
      />

      <div className="patient-page__table-wrap">
        <table className="patient-page__table">
          <thead className="patient-page__thead">
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Blood Group</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2].map((skeletonRow) => (
                <tr key={`patient-skeleton-${skeletonRow}`} className="patient-page__row">
                  <td><span className="table-skeleton table-skeleton--short" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton" /></td>
                  <td><span className="table-skeleton" /></td>
                </tr>
              ))
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((doc, index) => (
                <tr key={doc._id || index} className="patient-page__row">
                  <td>{index + 1}</td>
                  <td>
                    <button
                      className="admin-drawer-name-btn"
                      onClick={() => setSelectedPatient(doc)}
                    >
                      {doc.name}
                    </button>
                  </td>
                  <td>{doc.age || "N/A"}</td>
                  <td>{doc.bloodgroup || doc.bloodGroup || "N/A"}</td>
                  <td>{doc.address || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="patient-page__empty">
                  No Patient found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Patient Detail Drawer */}
      {selectedPatient && (
        <>
          <div
            className="admin-drawer-overlay"
            onClick={() => setSelectedPatient(null)}
          />
          <div className="admin-drawer">
            <div className="admin-drawer__header">
              <h3 className="admin-drawer__title">Patient Details</h3>
              <button
                className="admin-drawer__close"
                onClick={() => setSelectedPatient(null)}
              >
                ✕
              </button>
            </div>
            <div className="admin-drawer__content">
              <div className="admin-drawer__info-grid">
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Name</span>
                  <span className="admin-drawer__value">{selectedPatient.name || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Email</span>
                  <span className="admin-drawer__value">{selectedPatient.email || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Age</span>
                  <span className="admin-drawer__value">{selectedPatient.age || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Gender</span>
                  <span className="admin-drawer__value">{selectedPatient.gender || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Blood Group</span>
                  <span className="admin-drawer__value">
                    {selectedPatient.bloodgroup || selectedPatient.bloodGroup || "N/A"}
                  </span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Phone Number</span>
                  <span className="admin-drawer__value">
                    {selectedPatient.contactNumber || "N/A"}
                  </span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Address</span>
                  <span className="admin-drawer__value">{selectedPatient.address || "N/A"}</span>
                </div>
                <div className="admin-drawer__info-item">
                  <span className="admin-drawer__label">Joined</span>
                  <span className="admin-drawer__value">
                    {selectedPatient.createdAt
                      ? new Date(selectedPatient.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
