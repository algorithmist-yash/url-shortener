require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("../config/db"); // ✅ correct path
const urlRoutes = require("./routes/urlRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/", urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
