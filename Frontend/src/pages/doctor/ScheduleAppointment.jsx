import React, { useState, useEffect } from "react";
import "../../styles/ScheduleAppointment.css";

export default function ScheduleAppointment() {
 const [appointment, setAppointment] = useState([]);

 useEffect(() => {
   const fetchAppointments = async () => {
     try {
       const res = await fetch("http://localhost:8000/api/v1/doctor/getAllAppointments?drname=Dr.Kumar");
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

 const futureAppointments = appointment
   .filter((a) => {
     const apptDate = new Date(a.date);
     return apptDate >= today;
   })
   .sort((a, b) => new Date(a.date) - new Date(b.date));

 return (
   <div className="schedule-appointment-page">
     <h2 className="schedule-appointment-page__title">Scheduled Appointments</h2>

     <div className="schedule-appointment-page__table-wrap">
       <table className="schedule-appointment-page__table">
         <thead className="schedule-appointment-page__thead">
           <tr>
             <th>ID</th>
             <th>Name</th>
             <th>Date</th>
             <th>Time</th>
             <th>Status</th>
           </tr>
         </thead>

         <tbody>
           {futureAppointments.length > 0 ? (
             futureAppointments.map((a, index) => (
               <tr key={a._id} className="schedule-appointment-page__row">
                 <td>{index + 1}</td>
                 <td>{a.patientId?.name}</td>
                 <td>{new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                 <td>{new Date(a.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
                 <td>
                   <span className={`schedule-appointment-page__status schedule-appointment-page__status--${a.status || "default"}`}>
                     {(a.status || "UNKNOWN").toUpperCase()}
                   </span>
                 </td>
               </tr>
             ))
           ) : (
             <tr>
               <td colSpan="5" className="schedule-appointment-page__empty">No upcoming appointments</td>
             </tr>
           )}
         </tbody>
       </table>
     </div>

     <div className="schedule-appointment-page__list">
       {Array.isArray(futureAppointments) && futureAppointments.map((item) => (
         <div key={item._id || item.id} className="schedule-appointment-page__list-card">
           <h3>Patient: {item.patientId?.name || "Not Assigned"}</h3>
           <p>Status: {item.status}</p>
           <p>Amount: ₹{item.amount}</p>
         </div>
       ))}
     </div>
   </div>
 );
}

