import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { DUMMY_PROPERTIES } from "./src/data/mockData";

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/properties", async (req, res) => {
    const { type, category, location } = req.query;

    if (!supabase) {
      // Fallback to dummy data if Supabase is not configured
      let filtered = [...DUMMY_PROPERTIES];
      if (type) filtered = filtered.filter(p => p.type === type);
      if (category) filtered = filtered.filter(p => p.category === category);
      if (location) filtered = filtered.filter(p => p.location.toLowerCase().includes((location as string).toLowerCase()));
      return res.json(filtered);
    }

    let query = supabase.from("properties").select("*");
    if (type) query = query.eq("type", type);
    if (category) query = query.eq("category", category);
    if (location) query = query.ilike("location", `%${location}%`);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    
    // Merge with dummy data for preview if database is empty
    const result = data && data.length > 0 ? data : DUMMY_PROPERTIES;
    res.json(result);
  });

  app.get("/api/properties/:id", async (req, res) => {
    if (!supabase || Number(req.params.id) >= 100) {
      const prop = DUMMY_PROPERTIES.find(p => p.id === Number(req.params.id));
      if (prop) return res.json(prop);
      if (!supabase) return res.status(404).json({ error: "Property not found" });
    }

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", req.params.id)
      .single();
    
    if (error) return res.status(404).json({ error: "Property not found" });
    res.json(data);
  });

  app.post("/api/properties", async (req, res) => {
    const { password, ...propertyData } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("properties")
      .insert([propertyData])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
  });

  app.delete("/api/properties/:id", async (req, res) => {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.post("/api/inquiries", async (req, res) => {
    const { data, error } = await supabase
      .from("inquiries")
      .insert([req.body]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ success: true });
  });

  app.get("/api/inquiries", async (req, res) => {
    if (!supabase) {
      return res.json([
        {
          name: "John Doe",
          email: "john@example.com",
          phone: "9876543210",
          message: "I am interested in the 3BHK Apartment in Sector 42. Please call me.",
          created_at: new Date().toISOString(),
          subject: "Property Inquiry"
        },
        {
          name: "Priya Sharma",
          email: "priya@gmail.com",
          phone: "9988776655",
          message: "Is the Luxury Villa in Sector 65 still available for site visit?",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          subject: "Site Visit Request"
        }
      ]);
    }
    
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.get("/api/testimonials", async (req, res) => {
    const { data, error } = await supabase.from("testimonials").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
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
