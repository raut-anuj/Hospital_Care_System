import { Routes, Route } from "react-router-dom";
import {
  Login,
  Signup,
  ForgotPassword,
  AdminLayout,
  DoctorLayout,
  PatientLayout,
  Dashboard,
  AdminAppointments,
  Patients,
  AdminDoctors,
  AppointmentList,
  DoctorDashboard,
  ScheduleAppointment,
  PatientDashboard,
  PatientAppointment,
  ProtectedRoute,
  Unauthorized,
  Home,
  About,
  Doctors,
  Contact,
} from "./components/index.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

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
        <Route path="doctors" element={<AdminDoctors />} />
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

// <Route path="/admin" element={<AdminLayout />}>
//   <Route index element={<Dashboard />} />
//   <Route path="doctors" element={<Doctors />} />
//   <Route path="patients" element={<Patients />} />
//   <Route path="appointments" element={<AdminAppointments />} />
// </Route>

// <Route path="/doctor" element={<DoctorLayout />}>
//   <Route index element={<DoctorDashboard />} />
//   <Route path="AppointmentList" element={<AppointmentList />} />
//   <Route path="ScheduleAppointment" element={<ScheduleAppointment />} />
// </Route>

// <Route path="/patient" element={<PatientLayout />}>
//   <Route index element={<PatientDashboard />} />
//   <Route path="appointment" element={<PatientAppointment />} />
// </Route>