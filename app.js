import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js"; // Import the initDb function
import urlRoutes from "./routes/urlRoutes.js"; // Import the urlRoutes

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use("/api", urlRoutes); // Mount urlRoutes on /api path

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/urls", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "urls.html")); // Adjust the path based on where you save the file
});

initDb()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err) => {
    console.error("Error initializing database:", err);
  });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
