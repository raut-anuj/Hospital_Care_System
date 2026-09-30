import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import "../../styles/AdminBills.css";
import API_URL from "../../api/api.js";

const FILTERS = ["All", "Paid", "Unpaid"];

export default function AdminBills() {
  const [activeFilter, setActiveFilter] = useState("All");
  const token = localStorage.getItem("token");

  const { data: bills = [], isLoading } = useQuery({
    queryKey: ["admin-bills"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/admin/revenue/bills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch bills");
      return json?.data || [];
    },
  });

  // Stat card counts
  const totalBills = bills.length;
  const paidBills = useMemo(() => bills.filter((b) => b.billStatus === "PAID"), [bills]);
  const unpaidBills = useMemo(() => bills.filter((b) => b.billStatus === "UNPAID"), [bills]);
  const totalRevenue = useMemo(
    () => paidBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    [paidBills]
  );

  // Filtered list based on active tab
  const filteredBills = useMemo(() => {
    if (activeFilter === "Paid") return paidBills;
    if (activeFilter === "Unpaid") return unpaidBills;
    return bills;
  }, [activeFilter, bills, paidBills, unpaidBills]);

  const stats = [
    { label: "Total Bills",       value: totalBills,          color: "blue"   },
    { label: "Paid",              value: paidBills.length,    color: "green"  },
    { label: "Unpaid",            value: unpaidBills.length,  color: "red"    },
    { label: "Revenue Collected", value: `₹${totalRevenue}`,  color: "purple" },
  ];

  return (
    <div className="admin-bills-page">

      {/* Header */}
      <div className="admin-bills-header">
        <h2 className="admin-bills-title">Payments &amp; Billing</h2>
        <p className="admin-bills-subtitle">
          View and manage all patient bills across the hospital.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="admin-bills-stats">
        {stats.map((s) => (
          <div key={s.label} className={`admin-bills-card admin-bills-card--${s.color}`}>
            <p className={`admin-bills-card__value admin-bills-card__value--${s.color}`}>
              {isLoading ? <span className="ab-skel ab-skel--value" /> : s.value}
            </p>
            <h3 className="admin-bills-card__label">{s.label}</h3>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="admin-bills-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`admin-bills-filter-btn ${activeFilter === f ? "admin-bills-filter-btn--active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bills Table */}
      <div className="admin-bills-table-wrap">
        <table className="admin-bills-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Appointment Date</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <tr key={i}>
                  <td><span className="ab-skel ab-skel--xs" /></td>
                  <td><span className="ab-skel ab-skel--md" /></td>
                  <td><span className="ab-skel ab-skel--md" /></td>
                  <td><span className="ab-skel ab-skel--sm" /></td>
                  <td><span className="ab-skel ab-skel--xs" /></td>
                  <td><span className="ab-skel ab-skel--xs" /></td>
                  <td><span className="ab-skel ab-skel--pill" /></td>
                </tr>
              ))
            ) : filteredBills.length > 0 ? (
              filteredBills.map((bill, index) => {
                const isPaid = bill.billStatus === "PAID";
                const patient = bill.patientId;
                const appointment = bill.appointmentId;
                const doctor = appointment?.doctorId;
                return (
                  <tr key={bill._id || index}>
                    <td className="admin-bills-table__num">
                      {String(index + 1).padStart(3, "0")}
                    </td>
                    <td className="admin-bills-table__bold">
                      {patient?.name || "N/A"}
                    </td>
                    <td>
                      <div className="admin-bills-doctor">
                        <span className="admin-bills-doctor__name">
                          {doctor?.name || "N/A"}
                        </span>
                        {doctor?.specialization && (
                          <span className="admin-bills-doctor__spec">
                            {doctor.specialization}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {appointment?.date
                        ? new Date(appointment.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="admin-bills-table__amount">₹{bill.totalAmount ?? "—"}</td>
                    <td className="admin-bills-table__amount">₹{bill.paidAmount ?? 0}</td>
                    <td>
                      <span className={`ab-status ab-status--${isPaid ? "paid" : "unpaid"}`}>
                        {isPaid ? "PAID" : "UNPAID"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="admin-bills-table__empty">
                  No bills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
