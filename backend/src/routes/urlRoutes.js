// routes/urlRoutes.js
const express = require("express");
const router = express.Router();

const {
  createShortUrl,
  redirectToOriginal,
  getAnalytics,
  expireUrlManually, // ✅ THIS WAS MISSING
} = require("../controllers/urlController");

router.post("/shorten", createShortUrl);
router.get("/analytics/:shortCode", getAnalytics);
router.patch("/expire/:shortCode", expireUrlManually);
router.get("/:shortCode", redirectToOriginal);

module.exports = router;
