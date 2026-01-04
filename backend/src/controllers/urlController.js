// controllers/urlController.js
const Url = require("../models/Url");
const { nanoid } = require("nanoid");

/* ---------------- CREATE SHORT URL ---------------- */
exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl, expiresInMinutes } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    // ✅ USE VALUE FROM FRONTEND, fallback to 30
    const expiryMinutes =
      Number(expiresInMinutes) > 0 ? Number(expiresInMinutes) : 30;

    const shortCode = nanoid(7);

    const expiresAt = new Date(
      Date.now() + expiryMinutes * 60 * 1000
    );

    const url = await Url.create({
      originalUrl,
      shortCode,
      expiresAt,
      isActive: true,
      clicks: 0,
    });

    res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      expiresAt: url.expiresAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


/* ---------------- REDIRECT ---------------- */
exports.redirectToOriginal = async (req, res) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode });

  if (!url || !url.isActive || url.expiresAt < new Date()) {
    return res.status(410).send("This link has expired");
  }

  url.clicks += 1;
  await url.save();

  res.redirect(url.originalUrl);
};


/* ---------------- ANALYTICS ---------------- */
exports.getAnalytics = async (req, res) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode });

  if (!url) {
    return res.status(404).json({ error: "URL not found" });
  }

  res.json({
    originalUrl: url.originalUrl,
    clicks: url.clicks,
    createdAt: url.createdAt,
    expiresAt: url.expiresAt,
    isActive: url.isActive && url.expiresAt > new Date(),
  });
};

/* ---------------- MANUAL EXPIRE (IMPORTANT) ---------------- */
exports.expireUrlManually = async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.shortCode });

  if (!url) return res.status(404).json({ error: "URL not found" });

  url.isActive = false;
  await url.save();

  res.json({ message: "URL expired manually" });
};
