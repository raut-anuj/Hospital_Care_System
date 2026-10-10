import React from "react";

export default function DoctorDashboard() {
  return (
    <div className="p-8 flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Welcome, Doctor
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            My Patients
          </h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Active cases
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Appointments Today
          </h3>
          <p className="text-3xl font-bold text-green-600">6</p>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Next at 3 PM
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Reports Pending
          </h3>
          <p className="text-3xl font-bold text-purple-600">3</p>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            To be reviewed
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <button className="bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-500">
          Add Patient
        </button>

        <button className="bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-500">
          Schedule Appointment
        </button>

        <button className="bg-purple-600 text-white py-3 rounded-lg shadow hover:bg-purple-500">
          Review Reports
        </button>

      </div>
    </div>
  );
}
 