import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("properties.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL, -- Apartment, Villa, Plot, Commercial
    category TEXT NOT NULL, -- Residential, Commercial
    bhk INTEGER,
    size TEXT,
    status TEXT DEFAULT 'Available',
    images TEXT, -- JSON array of image URLs
    amenities TEXT, -- JSON array
    featured INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(property_id) REFERENCES properties(id)
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    content TEXT NOT NULL,
    rating INTEGER
  );
`);

// Seed data if empty
const propertyCount = db.prepare("SELECT COUNT(*) as count FROM properties").get() as { count: number };
if (propertyCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO properties (title, description, price, location, type, category, bhk, size, images, amenities, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run(
    "Emerald Heights",
    "Luxury 3BHK apartment with modern amenities and city view.",
    "₹1.2 Cr",
    "Gurgaon, Sector 45",
    "Apartment",
    "Residential",
    3,
    "1800 sqft",
    JSON.stringify(["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"]),
    JSON.stringify(["Gym", "Pool", "Parking", "Security"]),
    1
  );

  insert.run(
    "The Grand Villa",
    "Spacious 5BHK villa with private garden and pool.",
    "₹4.5 Cr",
    "South Delhi, Vasant Vihar",
    "Villa",
    "Residential",
    5,
    "4500 sqft",
    JSON.stringify(["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"]),
    JSON.stringify(["Private Pool", "Garden", "Home Theater", "Solar Panels"]),
    1
  );

  insert.run(
    "Corporate Plaza",
    "Grade A office space in the heart of the business district.",
    "₹15 Cr",
    "Mumbai, BKC",
    "Commercial",
    "Commercial",
    0,
    "10000 sqft",
    JSON.stringify(["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"]),
    JSON.stringify(["High-speed Elevators", "Cafeteria", "Conference Rooms"]),
    1
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/properties", (req, res) => {
    const { type, category, location, minPrice, maxPrice } = req.query;
    let query = "SELECT * FROM properties WHERE 1=1";
    const params: any[] = [];

    if (type) {
      query += " AND type = ?";
      params.push(type);
    }
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (location) {
      query += " AND location LIKE ?";
      params.push(`%${location}%`);
    }

    const properties = db.prepare(query).all(...params);
    res.json(properties.map((p: any) => ({
      ...p,
      images: JSON.parse(p.images),
      amenities: JSON.parse(p.amenities)
    })));
  });

  app.get("/api/properties/:id", (req, res) => {
    const property = db.prepare("SELECT * FROM properties WHERE id = ?").get(req.params.id) as any;
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json({
      ...property,
      images: JSON.parse(property.images),
      amenities: JSON.parse(property.amenities)
    });
  });

  app.post("/api/inquiries", (req, res) => {
    const { property_id, name, email, phone, message } = req.body;
    const insert = db.prepare("INSERT INTO inquiries (property_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)");
    insert.run(property_id, name, email, phone, message);
    res.status(201).json({ success: true });
  });

  app.get("/api/testimonials", (req, res) => {
    const testimonials = db.prepare("SELECT * FROM testimonials").all();
    res.json(testimonials);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
