const Menu = require("../models/Menu");

// CREATE MENU ITEM
const createMenuItem = async (req, res) => {
  try {
    const { name, price, category,image } = req.body;

    const menuItem = await Menu.create({
      name,
      price,
      category,
      image,
    });

    res.status(201).json(menuItem);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL MENU ITEMS
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();

    res.json(menuItems);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MENU ITEM
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    menuItem.name = req.body.name || menuItem.name;
    menuItem.price = req.body.price || menuItem.price;
    menuItem.category = req.body.category || menuItem.category;
    menuItem.image = req.body.image || menuItem.image;
    menuItem.isAvailable =
      req.body.isAvailable ?? menuItem.isAvailable;

    const updatedItem = await menuItem.save();

    res.json(updatedItem);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE MENU ITEM
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await menuItem.deleteOne();

    res.json({ message: "Menu item deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports ={createMenuItem ,getMenuItems,updateMenuItem,deleteMenuItem}