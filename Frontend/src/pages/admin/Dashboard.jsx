import React from "react";
import Sidebar from "../../components/admin/Sidebar";

const stats = [
  {
    title: "Total Patients",
    value: 120,
    change: "+5 today",
    color: "text-blue-600",
  },
  {
    title: "Appointments",
    value: 45,
    change: "+3 today",
    color: "text-green-600",
  },
  {
    title: "Doctors",
    value: 12,
    change: "Active",
    color: "text-purple-600",
  },
];

export default function Dashboard() {
  const stats = [
    { title: "Total Patients", value: "120", change: "+5 this week", color: "text-green-600" },
    { title: "Appointments", value: "30", change: "Next: 3 today", color: "text-blue-600" },
    { title: "Critical Cases", value: "3", change: "Stable trend", color: "text-red-400" },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Dashboard
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Welcome back, Admin. Here’s your overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              {item.title}
            </h3>

            <p className={`text-4xl font-bold mt-2 ${item.color}`}>
              {item.value}
            </p>

            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

