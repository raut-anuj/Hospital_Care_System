import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "../../styles/DoctorDashboard.css";
import API_URL from "../../api/api.js";

export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState("Doctor");
  const token = localStorage.getItem("token");

  useEffect(() => {
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
  }, []);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["doctor-appointments"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/doctor/getAllAppointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch appointments");
      return data?.data || [];
    },
  });

  // Calculate total unique patients for this doctor from appointment list
  const uniquePatientsCount = new Set(
    appointments
      .map((a) => a.patientId?._id || a.patientId)
      .filter(Boolean)
  ).size;

  const scheduledCount = appointments.filter(
    (a) => (a.status || "").toLowerCase() === "scheduled"
  ).length;

  return (
    <div className="doctor-dashboard">
      <h2 className="doctor-dashboard__title">Welcome, {doctorName}</h2>

      <div className="doctor-dashboard__stats">
        <div className="doctor-dashboard__card">
          <h3>Patient</h3>
          <p className="doctor-dashboard__value doctor-dashboard__value--blue">
            {isLoading ? "..." : uniquePatientsCount}
          </p>
          <span>Total unique patients</span>
        </div>

        <div className="doctor-dashboard__card">
          <h3>Appointment</h3>
          <p className="doctor-dashboard__value doctor-dashboard__value--green">
            {isLoading ? "..." : scheduledCount}
          </p>
          <span>Scheduled appointments</span>
        </div>

        <div className="doctor-dashboard__card">
          <h3>Total Handled</h3>
          <p className="doctor-dashboard__value doctor-dashboard__value--purple">
            {isLoading ? "..." : appointments.length}
          </p>
          <span>All appointments</span>
        </div>
      </div>
    </div>
  );
}
