import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");

    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}

      <Link
        to="/"
        className="text-2xl font-bold text-orange-500"
      >
        FoodieHub
      </Link>

      {/* Navigation Links */}

      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-orange-500 font-medium transition"
        >
          Home
        </Link>

        <Link
          to="/orders"
          className="text-gray-700 hover:text-orange-500 font-medium transition"
        >
          Orders
        </Link>

        <Link
          to="/dashboard"
          className="text-gray-700 hover:text-orange-500 font-medium transition"
        >
          Dashboard
        </Link>
      </div>

      {/* Right Side */}

      <div className="flex items-center gap-4">
        {userInfo ? (
          <>
            {/* Avatar */}

            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
              {userInfo.name?.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}

            <div className="hidden md:block">
              <p className="font-semibold text-gray-800">
                {userInfo.name}
              </p>

              <p className="text-sm text-gray-500 capitalize">
                {userInfo.role}
              </p>
            </div>

            {/* Logout */}

            <button
              onClick={logoutHandler}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-orange-500 font-medium"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;