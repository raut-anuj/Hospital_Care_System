import React, { useState, useEffect } from "react";
import "../../styles/Doctor.css";

export default function Doctors() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/v1/admin/doctorsList?name=Admin"
        );

        const data = await res.json();
        setList(data?.data || []);
      } catch (err) {
        console.log("Error ", err);
      }
    };
    fetchList();
  }, []);

  const filteredDoctors = list
    .filter((doc) => doc.drname?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.drname.localeCompare(b.drname));

  return (
    <div className="doctor-page">
      <h2 className="doctor-page__title">Doctor List</h2>

      <input
        type="text"
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="doctor-page__search"
      />

      <div className="doctor-page__table-wrap">
        <table className="doctor-page__table">
          <thead className="doctor-page__thead">
            <tr>
              <th>ID</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Qualification</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, index) => (
                <tr key={doc._id || index} className="doctor-page__row">
                  <td>{index + 1}</td>
                  <td>{doc.drname}</td>
                  <td>{doc.specialization || "N/A"}</td>
                  <td>{doc.qualification || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="doctor-page__empty">
                  No Doctor found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="doctor-page__list">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div key={doc._id || doc.id} className="doctor-page__list-card">
              <h3 className="doctor-page__list-name">{doc.drname}</h3>
              <p>Specialization: {doc.specialization || "N/A"}</p>
              <p>Qualification: {doc.qualification || "N/A"}</p>
            </div>
          ))
        ) : (
          <div className="doctor-page__empty doctor-page__empty--block">No doctors found</div>
        )}
      </div>
    </div>
  );
}
