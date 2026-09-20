import React, { useEffect, useState, useMemo } from "react";
import "../../styles/Dashboard.css";
import API_URL from "../../api/api.js";

export default function Dashboard() {
  const [data, setData] = useState({
    patients: [],
    doctors: [],
    staff: [],
    appointments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const [patientsRes, doctorsRes, staffRes, appointmentsRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/admin/patientsList`, { headers }),
          fetch(`${API_URL}/api/v1/admin/doctorsList`, { headers }),
          fetch(`${API_URL}/api/v1/admin/staffsList`, { headers }),
          fetch(`${API_URL}/api/v1/admin/appointmentsList`, { headers }),
        ]);

        const [patientsJson, doctorsJson, staffJson, appointmentsJson] = await Promise.all([
          patientsRes.json(),
          doctorsRes.json(),
          staffRes.json(),
          appointmentsRes.json(),
        ]);

        setData({
          patients: Array.isArray(patientsJson?.data) ? patientsJson.data : [],
          doctors: Array.isArray(doctorsJson?.data) ? doctorsJson.data : [],
          staff: Array.isArray(staffJson?.data) ? staffJson.data : [],
          appointments: Array.isArray(appointmentsJson?.data) ? appointmentsJson.data : [],
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Compute live metrics directly from backend data
  const totalPatients = data.patients.length;
  const totalDoctors = data.doctors.length;
  const totalStaff = data.staff.length;
  const totalAppointments = data.appointments.length;

  const scheduledCount = useMemo(
    () => data.appointments.filter((a) => a.status === "scheduled").length,
    [data.appointments]
  );
  const completedCount = useMemo(
    () => data.appointments.filter((a) => a.status === "completed").length,
    [data.appointments]
  );
  const cancelledCount = useMemo(
    () => data.appointments.filter((a) => a.status === "cancelled").length,
    [data.appointments]
  );

  // Doctors by Specialization
  const specializationCounts = useMemo(() => {
    const counts = {};
    data.doctors.forEach((doc) => {
      const spec = doc.specialization || "General";
      counts[spec] = (counts[spec] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [data.doctors]);

  // Blood Group Distribution from registered patients
  const bloodGroups = useMemo(() => {
    const counts = { "A+": 0, "A-": 0, "B+": 0, "B-": 0, "O+": 0, "O-": 0, "AB+": 0, "AB-": 0 };
    data.patients.forEach((p) => {
      const bg = p.bloodgroup || p.bloodGroup;
      if (bg && counts[bg] !== undefined) {
        counts[bg] += 1;
      }
    });
    return counts;
  }, [data.patients]);

  // Recent 5 appointments from backend
  const recentAppointments = useMemo(() => {
    return data.appointments.slice(0, 5);
  }, [data.appointments]);

  return (
    <div className="dashboard-page">
      {/* Header without subtitle or extra buttons */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Hospital Overview</h2>
      </div>

      {/* KPI Cards Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3 className="dashboard-card__title">Total Patients</h3>
            <span className="dashboard-card__icon dashboard-card__icon--green">👥</span>
          </div>
          <p className="dashboard-card__value dashboard-card__value--green">
            {loading ? "..." : totalPatients}
          </p>
          <span className="dashboard-card__change">Registered patient accounts</span>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3 className="dashboard-card__title">Active Doctors</h3>
            <span className="dashboard-card__icon dashboard-card__icon--blue">👨‍⚕️</span>
          </div>
          <p className="dashboard-card__value dashboard-card__value--blue">
            {loading ? "..." : totalDoctors}
          </p>
          <span className="dashboard-card__change">Across {specializationCounts.length} departments</span>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3 className="dashboard-card__title">Hospital Staff</h3>
            <span className="dashboard-card__icon dashboard-card__icon--purple">🏥</span>
          </div>
          <p className="dashboard-card__value dashboard-card__value--purple">
            {loading ? "..." : totalStaff}
          </p>
          <span className="dashboard-card__change">Nursing & operational crew</span>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3 className="dashboard-card__title">Appointments</h3>
            <span className="dashboard-card__icon dashboard-card__icon--indigo">📅</span>
          </div>
          <p className="dashboard-card__value dashboard-card__value--indigo">
            {loading ? "..." : totalAppointments}
          </p>
          <span className="dashboard-card__change">
            {scheduledCount} active scheduled
          </span>
        </div>
      </div>

      {/* Middle Operations Row */}
      <div className="dashboard-row">
        {/* Appointments Status Progress */}
        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <h3 className="dashboard-panel__title">OPD Workload Breakdown</h3>
            <span className="dashboard-panel__badge">{totalAppointments} Total</span>
          </div>

          <div className="workload-bar">
            {totalAppointments > 0 ? (
              <>
                <div
                  className="workload-bar__segment workload-bar__segment--scheduled"
                  style={{ width: `${(scheduledCount / totalAppointments) * 100}%` }}
                  title={`Scheduled: ${scheduledCount}`}
                />
                <div
                  className="workload-bar__segment workload-bar__segment--completed"
                  style={{ width: `${(completedCount / totalAppointments) * 100}%` }}
                  title={`Completed: ${completedCount}`}
                />
                <div
                  className="workload-bar__segment workload-bar__segment--cancelled"
                  style={{ width: `${(cancelledCount / totalAppointments) * 100}%` }}
                  title={`Cancelled: ${cancelledCount}`}
                />
              </>
            ) : (
              <div className="workload-bar__segment workload-bar__segment--empty" style={{ width: "100%" }} />
            )}
          </div>

          <div className="workload-legend">
            <div className="workload-legend__item">
              <span className="workload-legend__dot workload-legend__dot--scheduled" />
              <span>Scheduled: <strong>{scheduledCount}</strong></span>
            </div>
            <div className="workload-legend__item">
              <span className="workload-legend__dot workload-legend__dot--completed" />
              <span>Completed: <strong>{completedCount}</strong></span>
            </div>
            <div className="workload-legend__item">
              <span className="workload-legend__dot workload-legend__dot--cancelled" />
              <span>Cancelled: <strong>{cancelledCount}</strong></span>
            </div>
          </div>

          {/* Recent Appointments Table */}
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((app) => (
                    <tr key={app._id}>
                      <td className="dashboard-table__bold">
                        {app.patientId?.name || "Patient"}
                      </td>
                      <td>
                        {app.doctorId?.name || "Doctor"}
                        <small className="dashboard-table__sub">
                          {app.doctorId?.specialization ? ` (${app.doctorId.specialization})` : ""}
                        </small>
                      </td>
                      <td>
                        {app.date ? new Date(app.date).toLocaleDateString() : "N/A"}{" "}
                        <span className="dashboard-table__time">{app.time || ""}</span>
                      </td>
                      <td>
                        <span className={`status-pill status-pill--${app.status || "scheduled"}`}>
                          {app.status || "scheduled"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="dashboard-table__empty">
                      No recent appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Blood Group & Departments */}
        <div className="dashboard-side-col">
          {/* Blood Group Emergency Registry */}
          <div className="dashboard-panel">
            <div className="dashboard-panel__header">
              <h3 className="dashboard-panel__title">🩸 Blood Group Registry</h3>
              <span className="dashboard-panel__badge">Donors</span>
            </div>
            <div className="blood-grid">
              {Object.entries(bloodGroups).map(([group, count]) => (
                <div key={group} className="blood-card">
                  <span className="blood-card__group">{group}</span>
                  <span className="blood-card__count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Capacity */}
          <div className="dashboard-panel">
            <div className="dashboard-panel__header">
              <h3 className="dashboard-panel__title">🩺 Doctors by Department</h3>
              <span className="dashboard-panel__badge">{specializationCounts.length} Depts</span>
            </div>
            <div className="department-list">
              {specializationCounts.length > 0 ? (
                specializationCounts.map(([spec, count]) => (
                  <div key={spec} className="department-item">
                    <span className="department-item__name">{spec}</span>
                    <span className="department-item__badge">{count} {count === 1 ? "Doctor" : "Doctors"}</span>
                  </div>
                ))
              ) : (
                <p className="dashboard-table__empty">No doctor departments recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
