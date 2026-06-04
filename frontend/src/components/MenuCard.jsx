function MenuCard({ item, addToCart, cart }) {
  const cartItem = cart.find((cartItem) => cartItem._id === item._id);
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
          }
          alt={item.name}
          className="w-full h-56 object-cover"
        />

        <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {item.category}
        </span>

        <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          ₹ {item.price}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold
    ${
      item.isAvailable
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }
  `}
        >
          {item.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>

        <p className="text-gray-500 text-sm mb-4">
          Freshly prepared and served hot.
        </p>

        {cartItem && (
          <div className="mb-3 text-center">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
              In Cart: {cartItem.quantity}
            </span>
          </div>
        )}

        <button
          disabled={!item.isAvailable}
          onClick={() => addToCart(item)}
          className={`w-full py-3 rounded-xl font-semibold transition
    ${
      item.isAvailable
        ? "bg-orange-500 hover:bg-orange-600 text-white"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
        >
          {item.isAvailable ? "Add To Order" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}

export default MenuCard;
