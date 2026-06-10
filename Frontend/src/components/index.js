import Button from './Button'
import Input from './Input'
import Login from './Login'
import Signup from './Signup'
import Home from '../pages/Home'
import Card from '../components/Card'
import Footer from '../components/Footer/Footer'
import ForgotPassword from '../components/ForgotPassword'

// import Card from "../components/admin/Card"
import Navbar from "../components/admin/Navbar"
import Sidebar from '../components/admin/Sidebar'
import DoctorSidebar from "../components/doctor/DoctorSidebar"
import PatientSidebar from "../components/paient/PatientSidebar"

import Header from "../components/Header/Header"

import AdminLayout from "../layout/AdminLayout"
import DoctorLayout from "../layout/DoctorLayout"
import PatientLayout from "../layout/PatientLayout"

import Dashboard from "../pages/admin/Dashboard";
import Doctors from "../pages/admin/Doctor";
import Patients from "../pages/admin/Patient";
import AdminAppointments from "../pages/admin/Apointment"

import DoctorDashboard from "../pages/doctor/DoctorDashboard"
import AppointmentList from "../pages/doctor/AppointmentList.jsx"
import ScheduleAppointment from "../pages/doctor/ScheduleAppointment.jsx"

import PatientAppointment from "../pages/patient/PatientAppointment"
import PatientDashboard from "../pages/patient/PatientDashboard"

import ProtectedRoute from "../routes/ProtectedRoute"

import Unauthorized from  "../pages/Unauthorized.jsx"

export {
    Home,
    Button,
    Footer,
    Input,
    Login,
    Signup,
    Header,
    Card,
    ForgotPassword,

    //admin
    Navbar,
    Sidebar,

    //doctor
    // DoctorAppointments,
    DoctorSidebar,

    //layout
    AdminLayout,
    DoctorLayout,
    PatientLayout,

    //pages--->admin
    Dashboard,
    Doctors,
    Patients,
    AdminAppointments,

    //pages--->doctor
    DoctorDashboard,
    AppointmentList,
    ScheduleAppointment,

    //pages--->patient
    PatientDashboard,
    PatientAppointment,
    PatientSidebar,

    ProtectedRoute,
    Unauthorized,
}
