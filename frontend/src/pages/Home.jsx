import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import MenuCard from "../components/MenuCard";
import { apiUrl } from "../config/api";

const Home = () => {
  const [menu, setMenu] = useState([]);

  const [cart, setCart] = useState([]);

  const [customerName, setCustomerName] = useState("");

  const [tableNumber, setTableNumber] = useState("");

  const [deliveryType, setDeliveryType] = useState("Dine-In");

  const [notes, setNotes] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchMenu = async () => {
    try {
      const response = await fetch(apiUrl("/api/menu"));

      const data = await response.json();

      setMenu(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);

    if (existingItem) {
      const updatedCart = cart.map((cartItem) =>
        cartItem._id === item._id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            }
          : cartItem,
      );

      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...item,
          quantity: 1,
        },
      ]);
    }
  };

  const placeOrder = async () => {
    try {
      if (!customerName.trim()) {
        return toast.error("Please enter customer name");
      }

      if (deliveryType === "Dine-In" && !tableNumber) {
        return toast.error("Please enter table number");
      }
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      setPlacingOrder(true);
      const response = await fetch(apiUrl("/api/orders"), {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          customerName,

          tableNumber: deliveryType === "Dine-In" ? tableNumber : null,

          deliveryType,

          notes,

          items: cart.map((item) => ({
            menuItem: item._id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      console.log(data);

      toast.success("Order placed successfully");

      setCart([]);

      setCustomerName("");

      setTableNumber("");

      setDeliveryType("Dine-In");

      setNotes("");
    } catch (error) {
      console.log(error);
    } finally {
      setPlacingOrder(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };
  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const categories = ["All", ...new Set(menu.map((item) => item.category))];

  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  console.log("Menu:", menu);
  console.log("Filtered:", filteredMenu);
  console.log("Search:", search);
  console.log(filteredMenu.length);
  console.log(filteredMenu.map((item) => item.name));
  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold mb-8">Restaurant Menu</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Dishes</h2>

        <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold">
          {filteredMenu.length} Items
        </span>
      </div>
      <input
        type="text"
        placeholder="Search dishes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 border p-3 rounded-xl mb-6"
      />
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-semibold transition
      ${
        selectedCategory === category
          ? "bg-orange-500 text-white"
          : "bg-white border hover:bg-orange-50"
      }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMenu.map((item) => (
          <MenuCard key={item._id} item={item} addToCart={addToCart} cart={cart} />
        ))}
      </div>

      <div className="mt-10 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-3xl font-bold mb-5">Order Cart</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border p-3 rounded-lg"
          />

          {deliveryType === "Dine-In" && (
            <input
              type="number"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="border p-3 rounded-lg"
            />
          )}

          <select
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option>Dine-In</option>

            <option>Takeaway</option>

            <option>Delivery</option>
          </select>

          <input
            type="text"
            placeholder="Order Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="mt-8">
          {cart.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 border rounded-2xl p-4 mb-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>

                  <p className="text-gray-500 text-sm">₹ {item.price} each</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      -
                    </button>

                    <span className="px-4 font-bold text-lg">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQty(item._id)}
                      className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <div className="mt-6 bg-orange-50 border border-orange-100 p-5 rounded-2xl">
              <div className="flex justify-between mb-2">
                <span>Total Items</span>
                <span className="font-bold">{totalItems}</span>
              </div>

              <div className="flex justify-between text-xl font-bold text-orange-600">
                <span>Total</span>
                <span>₹ {cartTotal}</span>
              </div>
            </div>
          )}
        </div>
        <p className="text-gray-600">Items: {totalItems}</p>
        {cart.length > 0 && (
          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className="mt-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
