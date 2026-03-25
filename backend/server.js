require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/ai",aiRoutes);
const studentRoutes = require("./routes/studentRoutes");
const educatorRoutes = require("./routes/educatorRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/student",studentRoutes);
app.use("/api/educator",educatorRoutes);
app.use("/api/admin",adminRoutes);
sequelize.sync().then(()=>{

  app.listen(process.env.PORT,()=>{

    console.log("Server running on port",process.env.PORT);

  });

});