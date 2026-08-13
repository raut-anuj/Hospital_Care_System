import React, { useState, useEffect } from "react";
import "../../styles/AppointmentList.css";
import API_URL from "../../api/api.js";

export default function AppointmentList() {
 const [appointment, setAppointment] = useState([]);

 useEffect(() => {
   const fetchAppointments = async () => {
     try {
       const res = await fetch(
        `${API_URL}/api/v1/doctor/getAllAppointments?drname=Dr.Kumar`,
        // "http://localhost:8000/api/v1/doctor/getAllAppointments?drname=Dr.Kumar"
      );
       const data = await res.json();
       setAppointment(data?.data || []);
     } catch (err) {
       console.log("Error ", err);
     }
   };
   fetchAppointments();
 }, []);

 const today = new Date();
 today.setHours(0, 0, 0, 0);

 const PastAppointments = appointment
   .filter((a) => {
     const apptDate = new Date(a.date);
     return apptDate < today;
   })
   .sort((a, b) => new Date(a.date) - new Date(b.date));

 return (
   <div className="appointment-list-page">
     <h2 className="appointment-list-page__title">Patient Appointment List</h2>

     <div className="appointment-list-page__table-wrap">
       <table className="appointment-list-page__table">
         <thead className="appointment-list-page__thead">
           <tr>
             <th>ID</th>
             <th>Name</th>
             <th>Date</th>
             <th>Time</th>
             <th>Status</th>
           </tr>
         </thead>

         <tbody>
           {PastAppointments.length > 0 ? (
             PastAppointments.map((a, index) => (
               <tr key={a._id} className="appointment-list-page__row">
                 <td>{index + 1}</td>
                 <td>{a.patientId?.name}</td>
                 <td>{new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                 <td>{new Date(a.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
                 <td>
                   <span className={`appointment-list-page__status appointment-list-page__status--${a.status || "default"}`}>
                     {(a.status || "UNKNOWN").toUpperCase()}
                   </span>
                 </td>
               </tr>
             ))
           ) : (
             <tr>
               <td colSpan="5" className="appointment-list-page__empty">No upcoming appointments</td>
             </tr>
           )}
         </tbody>
       </table>
     </div>

     <div className="appointment-list-page__list">
       {Array.isArray(PastAppointments) && PastAppointments.map((item) => (
         <div key={item._id || item.id} className="appointment-list-page__list-card">
           <h3>Patient: {item.patientId?.name || "Not Assigned"}</h3>
           <p>Status: {item.status}</p>
           <p>Amount: ₹{item.amount}</p>
         </div>
       ))}
     </div>
   </div>
 );
}
