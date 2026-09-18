import React, { useState, useEffect } from "react";
import "../../styles/PatientAppointment.css";
import API_URL from "../../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "../../components/Toast";

export default function PatientAppointment() {
  const queryClient = useQueryClient();
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reschedulingId, setReschedulingId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const token = localStorage.getItem("token");

  const appointmentsQuery = useQuery({
    queryKey: ["patient-appointments"],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/patient/getAppointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch appointments");
      }
      return (data?.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
    },
  });

  const doctorsQuery = useQuery({
    queryKey: ["patient-doctors"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/admin/doctorsList`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch doctors");
      }
      return [...(data?.data || [])].sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  useEffect(() => {
    if (appointmentsQuery.data) {
      setAppointments(appointmentsQuery.data);
    }
  }, [appointmentsQuery.data]);

  useEffect(() => {
    if (doctorsQuery.data) {
      setDoctors(doctorsQuery.data);
    }
  }, [doctorsQuery.data]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!patientName || !age || !email || !gender || !doctor || !date || !time) {
      setError("All fields are required");
      return;
    }

    if (date < today) {
      setError("Appointment date cannot be in the past");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/v1/patient/createAppointment`
        // "http://localhost:8000/api/v1/patient/createAppointment"
        , {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: patientName,
            age,
            email,
            gender,
            doctorName: doctor,
            date,
            time,
          }),
        });

      const data = await res.json();

      if (data.success) {
        setDoctor("");
        setDate("");
        setTime("");
        setError("");
        setShowForm(false);
        setToast({ message: "Appointment booked successfully!", type: "success" });
        queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      } else {
        setError(data.message || "Appointment booking failed");
      }
    } catch (err) {
      console.log(err);
      setError("Server error");
    }
  };

  const handleReschedule = async (appointmentId) => {
    if (!rescheduleDate) {
      setRescheduleError("Select a date");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/patient/rescheduleAppointment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ appointmentId, date: rescheduleDate }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to reschedule appointment");
      }

      setReschedulingId(null);
      setRescheduleDate("");
      setRescheduleError("");
      setToast({ message: "Appointment rescheduled successfully!", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
    } catch (err) {
      setRescheduleError(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setPatientName(user?.name || "");
        setEmail(user?.email || "");
        setAge(user?.age ?? "");
        setGender(user?.gender || user?.sex || "");
      } catch (err) {
        console.error("PATIENT USER DATA ERROR:", err);
      }
    }

    const fetchPatientProfile = async () => {
      if (!token) {
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/v1/patient/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch patient profile");
        }

        const patient = data?.data;
        setPatientName(patient?.name || "");
        setEmail(patient?.email || "");
        setAge(patient?.age ?? "");
        setGender(patient?.gender || "");
      } catch (err) {
        console.error("PATIENT PROFILE ERROR:", err);
      }
    };

    fetchPatientProfile();
  }, []);

  return (
    <div className="patient-appointment-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="patient-appointment-header">
        <div>
          <h2>My Appointment</h2>
          <p>View your upcoming and past appointments</p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="patient-appointment-button">
          + New Appointment
        </button>
      </div>

      {showForm && (
        <div className="patient-appointment-form-card patient-appointment-form-card--visible">
          <h2>Book New Appointment</h2>

          <div className="patient-appointment-form-grid">
            <div>
              <label>Patient Name</label>
              <input type="text" value={patientName} readOnly placeholder="Enter patient name" className="patient-appointment-input" />
            </div>

            <div>
              <label>Contact Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="patient-appointment-input" />
            </div>

            <div>
              <label>Doctor</label>
              <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className="patient-appointment-input">
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor.name}>{doctor.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Age</label>
              <input type="number" value={age} readOnly placeholder="Enter your age" className="patient-appointment-input" />
            </div>

            <div>
              <label>Date</label>
              <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="patient-appointment-input" />
            </div>

            <div>
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="patient-appointment-input">
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label>Preferred Time</label>
              <select value={time} onChange={(e) => setTime(e.target.value)} className="patient-appointment-input">
                <option>Select a Time</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>02:00 PM</option>
                <option>04:00 PM</option>
              </select>
            </div>
          </div>

          <div className="patient-appointment-note">
            <p>Doctor Consultation Fee Of Rs. 300 Will Be Charged At The Time Of Visit.</p>
          </div>

          <div className="patient-appointment-actions">
            <button onClick={() => setShowForm(false)} className="patient-appointment-cancel-btn">Cancel</button>
            <button onClick={handleConfirmBooking} className="patient-appointment-submit-btn">Confirm Booking</button>
          </div>

          {error && <p className="patient-appointment-error">{error}</p>}
        </div>
      )}

      <div className="patient-appointment-table-wrapper">
        <table className="patient-appointment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {appointmentsQuery.isLoading ? (
              [1, 2].map((skeletonRow) => (
                <tr key={`appointment-skeleton-${skeletonRow}`} className="patient-appointment-skeleton-row">
                  <td><span className="patient-appointment-skeleton patient-appointment-skeleton--short" /></td>
                  <td><span className="patient-appointment-skeleton" /></td>
                  <td><span className="patient-appointment-skeleton" /></td>
                  <td><span className="patient-appointment-skeleton" /></td>
                  <td><span className="patient-appointment-skeleton patient-appointment-skeleton--status" /></td>
                </tr>
              ))
            ) : Array.isArray(appointments) && appointments.length > 0 ? (
              appointments.map((a, index) => (
                <tr key={a._id || a.id}>
                  <td>{index + 1}</td>
                  <td>{a.doctorId?.name || "Not Assigned"}</td>
                  <td>{new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td>{a.time || "Not specified"}</td>
                  <td>
                    <button
                      type="button"
                      className="patient-appointment-status patient-appointment-status--clickable"
                      onClick={() => {
                        setReschedulingId(reschedulingId === a._id ? null : a._id);
                        setRescheduleDate("");
                        setRescheduleError("");
                      }}
                    >
                      {a.status?.toUpperCase()}
                    </button>
                    {reschedulingId === a._id && a.status === "scheduled" && (
                      <div className="patient-reschedule-panel">
                        <label htmlFor={`reschedule-${a._id}`}>Choose next date</label>
                        <input
                          id={`reschedule-${a._id}`}
                          type="date"
                          min={today}
                          value={rescheduleDate}
                          onChange={(event) => setRescheduleDate(event.target.value)}
                          className="patient-appointment-input"
                        />
                        <button
                          type="button"
                          className="patient-appointment-submit-btn"
                          onClick={() => handleReschedule(a._id)}
                        >
                          Confirm Date
                        </button>
                        {rescheduleError && <p className="patient-appointment-error">{rescheduleError}</p>}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="patient-appointment-empty">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
