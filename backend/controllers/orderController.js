const Order = require("../models/Order");
const Menu = require("../models/Menu");

const createOrder = async (req, res) => {
  try {

    const {
      items,
      tableNumber,
      customerName,
      notes,
      deliveryType,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    let totalAmount = 0;

    for (const item of items) {

      const menuItem = await Menu.findById(item.menuItem);

      if (!menuItem) {
        return res.status(404).json({
          message: "Menu item not found",
        });
      }

      totalAmount += menuItem.price * item.quantity;

    }

    const order = await Order.create({
      orderId: `ORD-${Date.now()}`,

      customerName,

      items,

      totalAmount,

      tableNumber,

      notes,

      deliveryType,

      createdBy: req.user._id,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("items.menuItem", "name price category")
      .populate("createdBy", "name email");

    // SOCKET.IO
    const io = req.app.get("io");
console.log("Emitting newOrder event");

    io.emit("newOrder", populatedOrder);

    res.status(201).json(populatedOrder);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getOrders = async (req, res) => {
  try {

    let query = {};

    // USER → only own orders
    if (req.user.role !== "admin") {
      query.createdBy = req.user._id;
    }

    const orders = await Order.find(query)
      .populate("items.menuItem", "name price category")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const updateOrderStatus = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = req.body.status || order.status;

    const updatedOrder = await order.save();

    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("items.menuItem", "name price category")
      .populate("createdBy", "name email");

    // SOCKET.IO
    const io = req.app.get("io");
console.log("Emitting orderUpdated event");
    io.emit("orderUpdated", populatedOrder);

    res.json(populatedOrder);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};