import express from "express";
import { openDb } from "../db.js"; // Import the database function

const router = express.Router();

const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

function generateShortUrl() {
  return Math.random().toString(36).substring(2, 8);
}

router.post("/shorten", async (req, res) => {
  const { original_url } = req.body;

  // Validate the original URL
  if (!original_url) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  // Check if the URL is valid
  if (!urlRegex.test(original_url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const short_url = generateShortUrl();

  try {
    const db = await openDb();
    await db.run(`INSERT INTO urls (original_url, short_url) VALUES (?, ?)`, [
      original_url,
      short_url,
    ]);
    await db.close();

    res.json({ original_url, short_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to shorten URL" });
  }
});

router.get("/:short_url", async (req, res) => {
  const { short_url } = req.params;

  const db = await openDb();
  try {
    const row = await db.get(
      `SELECT original_url FROM urls WHERE short_url = ?`,
      [short_url]
    );

    if (row) {
      return res.redirect(row.original_url);
    } else {
      return res.status(404).json({ error: "Short URL not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve URL" });
  } finally {
    await db.close();
  }
});

export default router;
