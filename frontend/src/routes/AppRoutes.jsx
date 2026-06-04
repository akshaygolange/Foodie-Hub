import React from "react";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import Orders from "../pages/Orders";
import Dashboard from "../pages/Dashboard";

import Layout from "../components/Layout";
import MenuManagement from "../pages/MenuManagement";

import Profile from "../pages/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Admin Only Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu-management"
          element={
            <AdminRoute>
              <MenuManagement />
            </AdminRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Protected User Route */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Public Routes */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
