import React, { useState, useEffect } from "react";
import PatientSidebar from "../../components/paient/PatientSidebar";

export default function PatientAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

const handleConfirmBooking = async (e) => {
  e.preventDefault();

  if (!patientName || !age || !email || !gender || !doctor || !date || !time) {
    setError("All fields are required");
    return;
  }

  try {
    const res = await fetch(
      "http://localhost:8000/api/v1/patient/createAppointment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: patientName,
          age,
          email,
          gender,
          drname: doctor,
          date,
          time,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Appointment booked successfully");

      setAppointments((prev) => [...prev, data.data]);

      setPatientName("");
      setEmail("");
      setAge("");
      setGender("");
      setDoctor("");
      setDate("");
      setTime("");
      setError("");
      setShowForm(false);
    } else {
      setError(data.message || "Appointment booking failed");
    }
  } catch (err) {
    console.log(err);
    setError("Server error");
  }
};

  useEffect(() => {

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/v1/patient/getAppointments?name=Raut Kumar"
        );

        const data = await res.json();

        const sortedAppointments = (data?.data || []).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setAppointments(sortedAppointments);
      } catch (err) {
        console.log("ERROR:", err);
      }
    };

    const fetchDoctors = async () => {

    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/admin/doctorsList");

        const data = await res.json();

        const sortedDoctors = [...data.data].sort((a, b) =>
              a.drname.localeCompare(b.drname)
            );

         setDoctors(sortedDoctors);
     
  }  catch (err) {
      console.log("DOCTOR ERROR:", err);
    }
  };

 fetchAppointments();
  fetchDoctors();
}, []);

 return (
  <div className="p-8 bg-blue-50 min-h-screen">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-800">
          My Appointment
        </h2>
        <p className="text-gray-500 mt-2">
          View your upcoming and past appointments
        </p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
      >
        + New Appointment
      </button>
    </div>

    {/* Same Photo Jaisa Form */}
    {showForm && (
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
          Book New Appointment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <label className="block font-semibold text-gray-800 mb-2">
               Patient Name
            </label>
            <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 outline-none"
          />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">
               Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 outline-none"
            />
          </div>

          <div>
          <label className="block font-semibold text-gray-800 mb-2">
            Doctor
          </label>

          <select 
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Doctor</option>

            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor.drname}>
                {doctor.drname}
              </option>
            ))}
          </select>
</div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">
               Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">
               Gender
            </label>
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
            >
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">
               Preferred Time
            </label>
            <select 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
            >
              <option>Select a Time</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>02:00 PM</option>
              <option>04:00 PM</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg py-4 mt-7 text-center">
          <p className="text-red-600 font-bold">
            Doctor Consultation Fee Of Rs. 300 Will Be Charged At The Time Of
            Visit.
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setShowForm(false)}
            className="bg-gray-200 text-gray-800 px-7 py-2.5 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          
            <button
      onClick={handleConfirmBooking}
      className="bg-blue-600 text-white px-7 py-2.5 rounded-lg hover:bg-blue-700 transition"
    >
      Confirm Booking
    </button>
        </div>

        {error && (
        <p className="text-red-600 text-center mt-4 font-medium">
          {error}
        </p>
      )}
      </div>
    )}

    {/* Table */}
    <div className="bg-white shadow rounded-xl overflow-hidden mb-8">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-gray-700">ID</th>
            <th className="text-gray-700">Doctor</th>
            <th className="text-gray-700">Date</th>
            <th className="text-gray-700">Time</th>
            <th className="text-gray-700">Status</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(appointments) &&
            appointments.map((a, index) => (
              <tr
                key={a._id || a.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3 text-gray-800">{index + 1}</td>
                <td className="text-gray-800">
                  {a.doctorId?.drname || "Not Assigned"}
                </td>
                <td className="text-gray-800">
                  {new Date(a.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="text-gray-800">
                  {new Date(a.date).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                    {a.status?.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);
}