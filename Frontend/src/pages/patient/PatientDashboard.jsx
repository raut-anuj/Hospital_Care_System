import { React, useEffect } from "react";
import { PatientSidebar } from "../../components/index.js";

export default function PatientDashboard() {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Heading */}
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Patient Dashboard
      </h2>

      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Welcome, Anuj Kumar
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Age: 25 | Patient ID: #P12345
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <h3 className="text-gray-700 dark:text-gray-200">Upcoming Appointments</h3>
          <p className="text-2xl font-bold text-blue-600">2</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <h3 className="text-gray-700 dark:text-gray-200">Prescriptions</h3>
          <p className="text-2xl font-bold text-green-600">5</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <h3 className="text-gray-700 dark:text-gray-200">Reports</h3>
          <p className="text-2xl font-bold text-purple-400">3</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <h3 className="text-gray-700 dark:text-gray-200">Billing</h3>
          <p className="text-2xl font-bold text-red-400">₹1200</p>
        </div>
      </div>

      {/* Upcoming Appointments Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Upcoming Appointments
        </h3>
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="text-gray-700 dark:text-gray-200 p-2">Doctor</th>
              <th className="text-gray-700 dark:text-gray-200 p-2">Date</th>
              <th className="text-gray-700 dark:text-gray-200 p-2">Time</th>
              <th className="text-gray-700 dark:text-gray-200 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="p-2 text-gray-800 dark:text-gray-100">Dr. Raju</td>
              <td className="p-2 text-gray-800 dark:text-gray-100">24 Apr 2026</td>
              <td className="p-2 text-gray-800 dark:text-gray-100">10:00 AM</td>
              <td>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  Scheduled
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Prescriptions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Prescriptions
        </h3>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
          <li>Paracetamol 500mg — Twice daily</li>
          <li>Vitamin D — Once daily</li>
        </ul>
      </div>

      {/* Reports */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Recent Reports
        </h3>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
          <li>Blood Test — Normal</li>
          <li>X-Ray — Pending Review</li>
        </ul>
      </div>
    </div>
  );
}

