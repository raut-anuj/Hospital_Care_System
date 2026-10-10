import { Outlet } from "react-router-dom";
import { Header, Footer, DoctorSidebar } from "../components/index.js";

export default function PatientLayout() {
  return (
    <div className="flex h-screen">
      <DoctorSidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
