import { Database, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/react.svg";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-screen bg-gradient-to-br from-purple-600 to-pink-500 p-6 text-white p-6 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-2" >
        <img className="w-12" src={Logo} alt="" />
        <div className="text-3xl font-bold flex flex-col">
          <span>Data Alchemist</span>
          <span className="text-base">
            Forge Your Own AI Resource‑Allocation Configurator
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          id="nav-manage"
          className={`px-4 py-3 rounded-md text-sm font-medium ${
            isActive("/manage") ? "bg-gray-600 text-white" : ""
          }`}
        >
          <Link className="flex items-center gap-1" to="/manage">
            <Database size={16} />
            Manage Data
          </Link>
        </button>
        <button
          id="nav-configure"
          className={`px-4 py-3 rounded-md text-sm font-medium ${
            isActive("/configure") ? "bg-gray-600 text-white" : ""
          }`}
        >
          <Link className="flex items-center gap-1" to="/configure">
            <Settings size={16} />
            Configure Rules
          </Link>
        </button>
      </div>
    </nav>
  );
}
