import { Header,  Sidebar } from "../components/index.js";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
 
      <main className="flex-1 p-6 overflow-y-auto">
        <Header />
        <Outlet />
        {/* <Footer/> */}
      </main>
    </div>
  );
}