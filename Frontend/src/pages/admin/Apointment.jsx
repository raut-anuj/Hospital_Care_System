import React, { useState } from "react";

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
      setAppointments(
        appointments.map((a) =>
          a.id === editId ? { ...a, ...form } : a
        )
      );
    } else {
      setAppointments([
        ...appointments,
        { id: Date.now(), ...form },
      ]);
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
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen text-black dark:text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Appointments
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Appointment
        </button>
      </div>

      {/* Search */}
      <input
        className="w-full mb-4 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        placeholder="Search by patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t dark:border-gray-700">

                <td className="p-3">{a.id}</td>
                <td>{a.patient}</td>
                <td>{a.doctor}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>

                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(a)}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 text-black dark:text-white">

            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Appointment" : "Add Appointment"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                name="patient"
                value={form.patient}
                onChange={handleChange}
                placeholder="Patient Name"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />

              <input
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                placeholder="Doctor Name"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />

              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />

              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />

              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editId ? "Update" : "Add"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
