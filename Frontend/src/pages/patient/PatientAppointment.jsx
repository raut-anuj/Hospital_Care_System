import React, { useState, useEffect } from "react";
import "../../styles/PatientAppointment.css";
import API_URL from "../../api/api";

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
   `${API_URL}/api/v1/patient/createAppointment`
  // "http://localhost:8000/api/v1/patient/createAppointment"
  , {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         name: patientName,
         age,
         email,
         gender,
         drname: doctor,
         date,
         time,
       }),
});

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
         `${API_URL}/api/v1/patient/getAppointments?name=Raut Kumar`
        // "http://localhost:8000/api/v1/patient/getAppointments?name=Raut Kumar"
      );
       const data = await res.json();
       const sortedAppointments = (data?.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
       setAppointments(sortedAppointments);
} catch (err) {
       console.log("ERROR:", err);
}
   };

   const fetchDoctors = async () => {
try {
       const res = await fetch(
         `${API_URL}/api/v1/admin/doctorsList`
        // "http://localhost:8000/api/v1/admin/doctorsList"
      );
       const data = await res.json();
       const sortedDoctors = [...data.data].sort((a, b) => a.drname.localeCompare(b.drname));
       setDoctors(sortedDoctors);
} catch (err) {
       console.log("DOCTOR ERROR:", err);
}
   };

   fetchAppointments();
   fetchDoctors();
 }, []);

 return (
   <div className="patient-appointment-page">
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
       <div className="patient-appointment-form-card">
         <h2>Book New Appointment</h2>

         <div className="patient-appointment-form-grid">
           <div>
             <label>Patient Name</label>
             <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter patient name" className="patient-appointment-input" />
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
                 <option key={doctor._id} value={doctor.drname}>{doctor.drname}</option>
               ))}
             </select>
           </div>

           <div>
             <label>Age</label>
             <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age" className="patient-appointment-input" />
           </div>

           <div>
             <label>Date</label>
             <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="patient-appointment-input" />
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
           {Array.isArray(appointments) &&
             appointments.map((a, index) => (
               <tr key={a._id || a.id}>
                 <td>{index + 1}</td>
                 <td>{a.doctorId?.drname || "Not Assigned"}</td>
                 <td>{new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                 <td>{new Date(a.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
                 <td><span className="patient-appointment-status">{a.status?.toUpperCase()}</span></td>
               </tr>
             ))}
         </tbody>
       </table>
</div>
   </div>
 );
}
