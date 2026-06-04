import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

import {
  FaHome,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaUserCircle,
  FaUserShield,
  FaUtensils,
} from "react-icons/fa";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // CHECK ROLE
  const isAdmin = userInfo?.role === "admin";

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const linkStyle = (path) => {
    return location.pathname === path
      ? "bg-orange-500 text-white shadow-lg"
      : "text-gray-300 hover:bg-gray-800 hover:text-white";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col justify-between shadow-2xl">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-3xl font-extrabold text-orange-400 tracking-wide">
              Foodie Hub
            </h1>

            <p className="text-gray-400 text-sm mt-1">Restaurant Management</p>
          </div>

          {/* User Info */}
          <div className="px-5 py-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <div className="bg-orange-500 p-3 rounded-full text-white text-xl shadow-lg">
                  <FaUserShield />
                </div>
              ) : (
                <div className="bg-gray-700 p-3 rounded-full text-white text-xl">
                  <FaUserCircle />
                </div>
              )}

              <div>
                <h2 className="font-semibold text-lg capitalize">
                  {userInfo?.name || "Guest"}
                </h2>

                {isAdmin ? (
                  <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold tracking-wide shadow">
                    ADMIN
                  </span>
                ) : (
                  <span className="bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full font-semibold">
                    USER
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2 p-4">
            {isAdmin && (
              <Link
                to="/dashboard"
                className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${linkStyle("/dashboard")}`}
              >
                <FaChartBar />
                Dashboard
              </Link>
            )}
            <Link
              to="/"
              className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${linkStyle("/")}`}
            >
              <FaHome />
              Home
            </Link>

            <Link
              to="/orders"
              className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${linkStyle("/orders")}`}
            >
              <FaClipboardList />
              Orders
            </Link>

            <Link
              to="/profile"
              className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${linkStyle("/profile")}`}
            >
              <FaUser />
              Profile
            </Link>

            {isAdmin && (
              <Link
                to="/menu-management"
                className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${linkStyle(
                  "/menu-management",
                )}`}
              >
                <FaUtensils />
                Menu Management
              </Link>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logoutHandler}
            className="w-full bg-red-500 hover:bg-red-600 transition-all duration-300 p-3 rounded-xl flex items-center justify-center gap-3 font-semibold"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
