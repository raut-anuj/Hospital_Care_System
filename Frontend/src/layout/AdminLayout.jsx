import { Header, Sidebar } from "../components/index.js";
import { Outlet } from "react-router-dom";
import "../styles/AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-layout__main">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}