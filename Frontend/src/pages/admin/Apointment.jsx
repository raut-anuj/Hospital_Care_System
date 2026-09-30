import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "../../styles/Apointment.css";
import API_URL from "../../api/api.js";

export default function Appointments() {
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["admin-appointments"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/admin/appointmentsList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch appointments");
      return data?.data || [];
    },
  });

  const filtered = appointments.filter((a) =>
    (a.patientId?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h2 className="appointments-title">Appointments</h2>
      </div>

      <input
        className="appointments-search"
        placeholder="Search by patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="appointments-table-wrap">
        <table className="appointments-table">
          <thead className="appointments-table__head">
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="appointments-table__empty">Loading appointments...</td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((a, index) => (
                <tr key={a._id || index} className="appointments-table__row">
                  <td>{index + 1}</td>
                  <td>{a.patientId?.name || "N/A"}</td>
                  <td>{a.doctorId?.name || "N/A"}</td>
                  <td>
                    {a.date
                      ? new Date(a.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td>{a.time || "N/A"}</td>
                  <td>
                     <span className={`status-pill status-pill--${a.status || "scheduled"}`}>
                        {a.status || "scheduled"}
                     </span>
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                <td colSpan="6" className="appointments-table__empty">No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
