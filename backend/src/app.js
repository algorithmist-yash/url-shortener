const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());              // 🔥 MUST be before routes
app.use(express.json());

const urlRoutes = require("./routes/urlRoutes");
app.use("/", urlRoutes);

app.get("/", (req, res) => {
  res.json({ status: "API running" });
});

module.exports = app;
