import React, { useEffect, useState } from "react";
import "../../styles/DoctorDashboard.css";
import API_URL from "../../api/api.js";

export default function DoctorDashboard() {
 const [patientCount, setPatientCount] = useState(0);
 const [appointmentCount, setAppointmentCount] = useState(0);
 const [doctorName, setDoctorName] = useState("Doctor");

 useEffect(() => {
   const token = localStorage.getItem("token");
   const storedUser = localStorage.getItem("user");

   if (storedUser) {
     try {
       const user = JSON.parse(storedUser);
       if (user?.name) {
         setDoctorName(user.name);
       }
     } catch (error) {
       console.error("Failed to read doctor name:", error);
     }
   }

   const fetchCounts = async () => {
     try {
       const [patientsRes, appointmentsRes] = await Promise.all([
         fetch(`${API_URL}/api/v1/doctor/getMyPatients`, {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         }),
         fetch(`${API_URL}/api/v1/doctor/getAllAppointments`, {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         }),
       ]);

       const patientsData = patientsRes.ok ? await patientsRes.json() : null;
       const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : null;

       const patients = Array.isArray(patientsData?.data) ? patientsData.data : [];
       const appointments = Array.isArray(appointmentsData?.data) ? appointmentsData.data : [];

       setPatientCount(patients.length);
       setAppointmentCount(appointments.length);
     } catch (error) {
       console.error("Doctor dashboard count fetch failed:", error);
       setPatientCount(0);
       setAppointmentCount(0);
     }
   };

   if (token) {
     fetchCounts();
   }
 }, []);

 return (
   <div className="doctor-dashboard">
     <h2 className="doctor-dashboard__title">Welcome, {doctorName}</h2>

     <div className="doctor-dashboard__stats">
       <div className="doctor-dashboard__card">
         <h3>My Patients</h3>
         <p className="doctor-dashboard__value doctor-dashboard__value--blue">{patientCount}</p>
         <span>Active cases</span>
       </div>

       <div className="doctor-dashboard__card">
         <h3>Appointments</h3>
         <p className="doctor-dashboard__value doctor-dashboard__value--green">{appointmentCount}</p>
         <span>Scheduled appointments</span>
       </div>

       <div className="doctor-dashboard__card">
         <h3>Reports Pending</h3>
         <p className="doctor-dashboard__value doctor-dashboard__value--purple">3</p>
         <span>To be reviewed</span>
       </div>
     </div>

     <div className="doctor-dashboard__actions">
       <button className="doctor-dashboard__button doctor-dashboard__button--blue">Add Patient</button>
       <button className="doctor-dashboard__button doctor-dashboard__button--green">Schedule Appointment</button>
       <button className="doctor-dashboard__button doctor-dashboard__button--purple">Review Reports</button>
     </div>
   </div>
 );
}
