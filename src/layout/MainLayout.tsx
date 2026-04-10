import Sidebar from "../components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#0F172A] text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        
        {/* 🔥 HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <h1 className="text-lg font-semibold">CareerTrans</h1>

          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>

      </main>
    </div>
  );
}