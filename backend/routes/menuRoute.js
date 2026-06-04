const express = require("express");
const router = express.Router();

const {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController")


const authorizeRoles =require("../middlewares/roleMiddleware")

const protect =require("../middlewares/authMiddleware")

//public
router.get("/",getMenuItems)


//protected //ADmin only
router.post("/",protect ,authorizeRoles("admin"),createMenuItem)
router.put("/:id",protect,authorizeRoles("admin"),updateMenuItem)

router.delete("/:id" ,protect,authorizeRoles("admin"),deleteMenuItem )






module.exports =router;
