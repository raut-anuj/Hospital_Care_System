import React, { useState, useEffect } from "react";
import "../../styles/Patient.css";

export default function Patients() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/v1/admin/patientsList?name=Admin"
        );

        const data = await res.json();
        setList(data?.data || []);
      } catch (err) {
        console.log("Error ", err);
      }
    };
    fetchList();
  }, []);

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
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((doc, index) => (
                <tr key={doc._id || index} className="patient-page__row">
                  <td>{index + 1}</td>
                  <td>{doc.name}</td>
                  <td>{doc.age || "N/A"}</td>
                  <td>{doc.address || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="patient-page__empty">
                  No Patient found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="patient-page__list">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((doc) => (
            <div key={doc._id || doc.id} className="patient-page__list-card">
              <h3 className="patient-page__list-name">{doc.name}</h3>
              <p>Age: {doc.age || "N/A"}</p>
              <p>Address: {doc.address || "N/A"}</p>
            </div>
          ))
        ) : (
          <div className="patient-page__empty patient-page__empty--block">No patient found</div>
        )}
      </div>
    </div>
  );
}
