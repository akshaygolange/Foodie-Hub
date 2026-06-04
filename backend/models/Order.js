const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: String,

    customerName: String,

    deliveryType: {
      type: String,
      enum: ["Dine-In", "Takeaway", "Delivery"],
      default: "Dine-In",
    },

    notes: String,

    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Served"],
      default: "Pending",
    },

    tableNumber: {
      type: Number,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);