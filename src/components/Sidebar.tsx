import { NavLink } from "react-router-dom";
import { Home, Calendar, Briefcase } from "lucide-react";
// import logo from "../assets/logonotagline.png";

const menu = [
  { name: "Dashboard", path: "/", icon: <Home size={18} /> },
  { name: "My Planner", path: "/planner", icon: <Calendar size={18} /> },
  // { name: "Today", path: "/today", icon: <Target size={18} /> },
  // { name: "Growth", path: "/growth", icon: <BarChart size={18} /> },
  { name: "Job Tracker", path: "/jobs", icon: <Briefcase size={18} /> },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#020617] p-4 border-r border-gray-800">
      
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
  {/* <img src={logo} className="w-50 h-50" /> */}
  <span className="text-xl font-bold">
    Career<span className="text-purple-500">Trans</span>
  </span>
</div>

      {/* Menu */}
      <nav className="space-y-2">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.path === "/"} // important for Dashboard
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                isActive ? "bg-purple-600" : "hover:bg-gray-800"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}