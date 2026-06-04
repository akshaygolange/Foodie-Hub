import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

import {
  ShoppingCart,
  Clock,
  ChefHat,
  CheckCircle,
  IndianRupee,
} from "lucide-react";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket", "polling"]
});

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const isAdmin = userInfo?.role === "admin" || userInfo?.isAdmin === true;

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.on("newOrder", (data) => {
      console.log("NEW ORDER RECEIVED", data);
      fetchOrders();
    });

    socket.on("orderUpdated", (data) => {
      console.log("ORDER UPDATED", data);
      fetchOrders();
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending",
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing",
  ).length;

  const readyOrders = orders.filter((order) => order.status === "Ready").length;

  const servedOrders = orders.filter(
    (order) => order.status === "Served",
  ).length;

  const revenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-3xl font-bold text-orange-500 animate-pulse">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-md">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            {isAdmin ? "Admin Dashboard" : "My Dashboard"}
          </h1>

          <p className="text-gray-500 mt-2">Welcome back, {userInfo?.name}</p>
        </div>

        <div className="mt-4 md:mt-0">
          <span className="bg-orange-500 text-white px-5 py-3 rounded-xl font-bold shadow">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-md border">
          <h2 className="text-gray-500 text-sm">Total Orders</h2>

          <p className="text-3xl font-bold mt-2 text-gray-800">{totalOrders}</p>
        </div>

        <div className="bg-yellow-100 p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <h2 className="text-yellow-700 text-sm">Pending</h2>

          <p className="text-3xl font-bold mt-2 text-yellow-800">
            {pendingOrders}
          </p>
        </div>

        <div className="bg-blue-100 p-5 rounded-2xl shadow-md">
          <h2 className="text-blue-700 text-sm">Preparing</h2>

          <p className="text-3xl font-bold mt-2 text-blue-800">
            {preparingOrders}
          </p>
        </div>

        <div className="bg-purple-100 p-5 rounded-2xl shadow-md">
          <h2 className="text-purple-700 text-sm">Ready</h2>

          <p className="text-3xl font-bold mt-2 text-purple-800">
            {readyOrders}
          </p>
        </div>

        <div className="bg-green-100 p-5 rounded-2xl shadow-md">
          <h2 className="text-green-700 text-sm">Served</h2>

          <p className="text-3xl font-bold mt-2 text-green-800">
            {servedOrders}
          </p>
        </div>

        <div className="bg-orange-100 p-5 rounded-2xl shadow-md">
          <h2 className="text-orange-700 text-sm">Revenue</h2>

          <p className="text-3xl font-bold mt-2 text-orange-800">₹ {revenue}</p>
        </div>
      </div>

      <div className="mt-10 bg-white rounded-2xl shadow-md p-5 border">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>

          <span className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold">
            {orders.length} Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Table</th>

                {isAdmin && <th className="p-3">Customer</th>}

                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="text-center p-5 text-gray-500"
                  >
                    No Orders Found
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg font-semibold">
                        Table {order.tableNumber}
                      </span>
                    </td>

                    {isAdmin && (
                      <td className="p-3">
                        <div>
                          <p className="font-semibold">
                            {order.createdBy?.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {order.createdBy?.email}
                          </p>
                        </div>
                      </td>
                    )}

                    <td className="p-3 font-semibold">₹ {order.totalAmount}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "Preparing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Ready"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-3 text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
