import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/properties", async (req, res) => {
    const { type, category, location } = req.query;
    let query = supabase.from("properties").select("*");

    if (type) query = query.eq("type", type);
    if (category) query = query.eq("category", category);
    if (location) query = query.ilike("location", `%${location}%`);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.get("/api/properties/:id", async (req, res) => {
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
