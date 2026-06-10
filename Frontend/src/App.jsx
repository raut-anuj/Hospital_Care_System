import { Routes, Route } from "react-router-dom";
import { Login, Signup } from "./components/index.js";
import { ForgotPassword } from "./components/index.js";

import { AdminLayout, DoctorLayout, PatientLayout } from "./components/index.js";

//admin
import { Dashboard, AdminAppointments, Patients, Doctors } from "./components/index.js";

//doctor
import { AppointmentList, DoctorDashboard, ScheduleAppointment } from "./components/index.js";

//patient
import { PatientDashboard } from "./components/index.js"
import { PatientAppointment }from "./components/index.js";
import { ProtectedRoute } from "./components/index.js";

import { Unauthorized, Home } from "./components/index.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="patients" element={<Patients />} />
        <Route path="appointments" element={<AdminAppointments />} />
      </Route>

      {/* Doctor routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="AppointmentList" element={<AppointmentList />} />
        <Route path="ScheduleAppointment" element={<ScheduleAppointment />} />
      </Route>

      {/* Patient routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
        <Route path="appointment" element={<PatientAppointment />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

//       <Route path="patients" element={<Patients />} />
//         <Route path="appointments" element={<Appointments />} />