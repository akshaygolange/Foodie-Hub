import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiUrl } from "../config/api";

function MenuManagement() {
  const [menu, setMenu] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchMenu = async () => {
    try {
      const response = await fetch(apiUrl("/api/menu"));

      const data = await response.json();

      setMenu(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? apiUrl(`/api/menu/${editingId}`)
        : apiUrl("/api/menu");

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${userInfo.token}`,
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        return toast.error(data.message);
      }

      toast.success(editingId ? "Menu item updated" : "Menu item added");
      fetchMenu();

      setFormData({
        name: "",
        price: "",
        category: "",
        image: "",
      });

      setEditingId(null);
    } catch (error) {
      console.log(error);
      toast.error("Submit failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this item?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(apiUrl(`/api/menu/${id}`), {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return toast.error(data.message);
      }

      toast.success("Menu item deleted");

      fetchMenu();
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image || "",
    });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold mb-8">Menu Management</h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow mb-8"
      >
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) =>
              setFormData({
                ...formData,
                image: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {editingId ? "Update Menu Item" : "Add Menu Item"}
        </button>
      </form>

      {/* MENU LIST */}

      <div className="grid gap-5">
        {menu.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div>
              <h2 className="text-xl font-bold">{item.name}</h2>

              <p className="text-gray-600">Category: {item.category}</p>

              <p className="text-orange-500 font-bold">₹ {item.price}</p>

              <span
                className={`text-sm font-semibold ${
                  item.isAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => handleEdit(item)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuManagement;
