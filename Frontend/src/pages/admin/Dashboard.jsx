import React from "react";
import "../../styles/Dashboard.css";

export default function Dashboard() {
  const stats = [
    { title: "Total Patients", value: "120", change: "+5 this week", color: "dashboard-card__value--green" },
    { title: "Appointments", value: "30", change: "Next: 3 today", color: "dashboard-card__value--blue" },
    { title: "Critical Cases", value: "3", change: "Stable trend", color: "dashboard-card__value--red" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">Welcome back, Admin. Here’s your overview.</p>
      </div>

      <div className="dashboard-grid">
        {stats.map((item, index) => (
          <div key={index} className="dashboard-card">
            <h3 className="dashboard-card__title">{item.title}</h3>
            <p className={`dashboard-card__value ${item.color}`}>{item.value}</p>
            <span className="dashboard-card__change">{item.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

