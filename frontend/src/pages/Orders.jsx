import { useEffect, useState, Fragment } from "react";

import { io } from "socket.io-client";
import { apiUrl, SOCKET_URL } from "../config/api";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"]
});


function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const isAdmin = userInfo?.role === "admin" || userInfo?.isAdmin === true;

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(apiUrl("/api/orders"), {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        console.log(data.message);

        setOrders([]);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(apiUrl(`/api/orders/${orderId}/status`), {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${userInfo.token}`,
        },

        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();

    // NEW ORDER EVENT
    socket.on("newOrder", (newOrder) => {
      if (isAdmin) {
        setOrders((prev) => [newOrder, ...prev]);
      } else {
        if (newOrder.createdBy?._id === userInfo._id) {
          setOrders((prev) => [newOrder, ...prev]);
        }
      }
    });

    // ORDER UPDATED EVENT
    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );
    });

    return () => {
      socket.off("newOrder");

      socket.off("orderUpdated");
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-3xl font-bold text-orange-500 animate-pulse">
          Loading Orders...
        </h2>
      </div>
    );
  }

  const filteredOrders = isAdmin
    ? orders.filter((order) => {
        const matchesStatus =
          statusFilter === "All" || order.status === statusFilter;

        const matchesSearch =
          order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          order.orderId?.toLowerCase().includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
      })
    : orders;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            {isAdmin ? "Restaurant Orders" : "My Orders"}
          </h1>

          <p className="text-gray-500 mt-2">
            {isAdmin
              ? "Manage all restaurant orders"
              : "Track your current and previous orders"}
          </p>
        </div>

        <div className="bg-orange-500 text-white px-5 py-3 rounded-2xl shadow-lg font-bold">
          Total Orders: {orders.length}
        </div>
      </div>

      {isAdmin && (
        <input
          type="text"
          placeholder="Search customer or order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-xl w-full md:w-80"
        />
      )}

      {isAdmin && (
        <div className="mb-8 bg-white p-4 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Filter Orders
          </h3>

          <div className="flex flex-wrap gap-3">
            {["All", "Pending", "Preparing", "Ready", "Served"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`
    px-5 py-2 rounded-full font-semibold text-sm
    transition-all duration-300 border flex items-center gap-2
    ${
      statusFilter === status
        ? status === "Pending"
          ? "bg-yellow-500 text-white border-yellow-500 shadow-lg"
          : status === "Preparing"
            ? "bg-blue-500 text-white border-blue-500 shadow-lg"
            : status === "Ready"
              ? "bg-purple-500 text-white border-purple-500 shadow-lg"
              : status === "Served"
                ? "bg-green-500 text-white border-green-500 shadow-lg"
                : "bg-orange-500 text-white border-orange-500 shadow-lg"
        : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:text-orange-500"
    }
  `}
                >
                  <span>{status}</span>

                  <span
                    className={`
      px-2 py-0.5 rounded-full text-xs font-bold
      ${
        statusFilter === status
          ? "bg-white/20 text-white"
          : "bg-gray-100 text-gray-600"
      }
    `}
                  >
                    {status === "All"
                      ? orders.length
                      : orders.filter((order) => order.status === status)
                          .length}
                  </span>
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-700">No Orders Found</h2>

          <p className="text-gray-500 mt-2">Orders will appear here</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              {/* Top */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Table #{order.tableNumber}
                    </h2>

                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                      #{order.orderId}
                    </span>

                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {order.deliveryType}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                  {/* ADMIN DETAILS */}
                  {isAdmin && order.createdBy && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-700">
                        Customer:
                        <span className="font-semibold ml-1">
                          {order.createdBy.name}
                        </span>
                      </p>

                      <p className="text-sm text-gray-700">
                        Email:
                        <span className="font-semibold ml-1">
                          {order.createdBy.email}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`px-5 py-2 rounded-full text-sm font-bold shadow
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
                </div>
              </div>

              <div className="mt-5">
                {(() => {
                  const steps = ["Pending", "Preparing", "Ready", "Served"];

                  const currentIndex = steps.indexOf(order.status);

                  return (
                    <div className="flex items-center">
                      {steps.map((step, index) => (
                        <Fragment key={step}>
                          {/* Circle */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${
                  index <= currentIndex
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
                            >
                              {index <= currentIndex ? "✓" : index + 1}
                            </div>

                            <span
                              className={`mt-2 text-[10px] md:text-xs font-semibold whitespace-nowrap
                ${index <= currentIndex ? "text-green-600" : "text-gray-500"}`}
                            >
                              {step}
                            </span>
                          </div>

                          {/* Line */}
                          {index < steps.length - 1 && (
                            <div
                              className={`flex-1 h-1 mx-2 rounded-full transition-all
                ${index < currentIndex ? "bg-green-500" : "bg-gray-200"}`}
                            />
                          )}
                        </Fragment>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl mb-5">
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">Notes:</span> {order.notes}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <h3 className="font-bold text-lg mb-3 text-gray-700">
                  Ordered Items
                </h3>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between border-b border-gray-200 pb-2"
                    >
                      <span className="text-gray-700">
                        {item.menuItem?.name || "Item deleted"}
                      </span>

                      <span className="font-semibold text-orange-500">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-gray-50 border border-gray-100 p-3 rounded-xl">
                <p className="text-sm font-medium text-gray-700">
                  {order.status === "Pending" &&
                    "🕒 Your order has been received and is waiting to be prepared."}

                  {order.status === "Preparing" &&
                    "👨‍🍳 The kitchen is preparing your order."}

                  {order.status === "Ready" && "🍽️ Your order is ready."}

                  {order.status === "Served" &&
                    "✅ Order completed. Enjoy your meal!"}
                </p>
              </div>

              {/* Bottom */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹ {order.totalAmount}
                  </p>
                </div>

                {/* ADMIN CONTROLS */}
                {isAdmin && (
                  <div className="flex gap-3 flex-wrap">
                    <button
                      disabled={order.status === "Preparing"}
                      onClick={() => updateStatus(order._id, "Preparing")}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl font-semibold transition-all"
                    >
                      Preparing
                    </button>

                    <button
                      disabled={order.status === "Ready"}
                      onClick={() => updateStatus(order._id, "Ready")}
                      className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl font-semibold transition-all"
                    >
                      Ready
                    </button>

                    <button
                      disabled={order.status === "Served"}
                      onClick={() => updateStatus(order._id, "Served")}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl font-semibold transition-all"
                    >
                      Served
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
