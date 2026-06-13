const express =require("express")
const cors =require("cors")
const { getAllowedOrigins } = require("./config/cors")

const app =express()

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json())

app.get("/",(req,res) =>{
    res.send("API is running...")
})

const authRoutes =require("./routes/authRoutes")

const menuRoutes =require("./routes/menuRoute")

const orderRoutes =require("./routes/orderRoutes")

app.use("/api/auth",authRoutes)
app.use("/api/menu",menuRoutes)
app.use("/api/orders" ,orderRoutes)
module.exports =app;
//this is where middlewaare and routes go