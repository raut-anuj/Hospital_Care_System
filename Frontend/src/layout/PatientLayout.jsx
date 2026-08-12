import { Header, Footer, PatientSidebar } from "../components/index.js";
import { Outlet } from "react-router-dom";
import "./PatientLayout.css";

export default function PatientLayout() {
  return (
    <div className="patient-layout">
      <PatientSidebar />

      <main className="patient-layout__main">
        <Header />
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
