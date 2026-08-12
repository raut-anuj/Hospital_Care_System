import { Outlet } from "react-router-dom";
import { Header, DoctorSidebar } from "../components/index.js";
import "./DoctorLayout.css";

export default function DoctorLayout() {
  return (
    <div className="doctor-layout">
      <DoctorSidebar />

      <main className="doctor-layout__main">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
