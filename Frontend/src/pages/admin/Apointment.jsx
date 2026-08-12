import React, { useState } from "react";
import "./Apointment.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([
    { id: 1, patient: "Rahul Sharma", doctor: "Dr. Mehta", date: "2026-04-22", time: "10:00 AM" },
    { id: 2, patient: "Ankit Verma", doctor: "Dr. Khan", date: "2026-04-23", time: "12:00 PM" },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    date: "",
    time: "",
  });

  const filtered = appointments.filter((a) =>
    a.patient.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setAppointments(appointments.map((a) => a.id === editId ? { ...a, ...form } : a));
    } else {
      setAppointments([...appointments, { id: Date.now(), ...form }]);
    }

    setForm({ patient: "", doctor: "", date: "", time: "" });
    setShowModal(false);
    setEditId(null);
  };

  const handleEdit = (a) => {
    setForm({
      patient: a.patient,
      doctor: a.doctor,
      date: a.date,
      time: a.time,
    });
    setEditId(a.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h2 className="appointments-title">Appointments</h2>
        <button onClick={() => setShowModal(true)} className="appointments-add-btn">
          Add Appointment
        </button>
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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="appointments-table__row">
                <td>{a.id}</td>
                <td>{a.patient}</td>
                <td>{a.doctor}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td className="appointments-actions">
                  <button onClick={() => handleEdit(a)} className="appointments-edit-btn">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="appointments-delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="appointments-modal-backdrop">
          <div className="appointments-modal">
            <h2 className="appointments-modal__title">
              {editId ? "Edit Appointment" : "Add Appointment"}
            </h2>

            <form onSubmit={handleSubmit} className="appointments-form">
              <input name="patient" value={form.patient} onChange={handleChange} placeholder="Patient Name" className="appointments-input" required />
              <input name="doctor" value={form.doctor} onChange={handleChange} placeholder="Doctor Name" className="appointments-input" required />
              <input name="date" type="date" value={form.date} onChange={handleChange} className="appointments-input" required />
              <input name="time" type="time" value={form.time} onChange={handleChange} className="appointments-input" required />

              <div className="appointments-modal__actions">
                <button type="button" onClick={() => setShowModal(false)} className="appointments-cancel-btn">Cancel</button>
                <button type="submit" className="appointments-submit-btn">{editId ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
