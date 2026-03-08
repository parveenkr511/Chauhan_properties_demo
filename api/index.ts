import express from "express";
import cors from "cors";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Backend is running on Vercel",
    supabase_connected: !!supabase,
    env_vars: {
      has_url: !!process.env.SUPABASE_URL,
      has_key: !!process.env.SUPABASE_ANON_KEY
    }
  });
});

app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Database not connected" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const file = req.file;
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `properties/${fileName}`;

  const { data, error } = await supabase.storage
    .from("property-images")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) {
    return res.status(500).json({ 
      error: error.message,
      message: "Make sure you have created a public bucket named 'property-images' in Supabase Storage."
    });
  }

  const { data: { publicUrl } } = supabase.storage
    .from("property-images")
    .getPublicUrl(filePath);

  res.json({ url: publicUrl });
});

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase: any = null;

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.error('Failed to initialize Supabase:', e);
}

const ADMIN_PASSWORD = "Shivansh@511";

const DUMMY_PROPERTIES = [
  {
    id: 101,
    title: "Skyview Residency",
    description: "Experience luxury living at its finest with panoramic city views and state-of-the-art facilities. This premium apartment complex offers spacious 3 and 4 BHK units with double-height ceilings.",
    price: "₹2.8 Cr",
    location: "Sector 42, Gurugram, Haryana",
    type: "Apartment",
    category: "Residential",
    bhk: 3,
    size: "2200 sqft",
    status: "Under Construction",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Infinity Pool", "Sky Lounge", "Automated Parking", "Concierge"],
    featured: 1
  },
  {
    id: 102,
    title: "Ocean Whisper Villa",
    description: "A serene escape located just minutes from the city center. This fully furnished villa features a private infinity pool, landscaped gardens, and a rooftop deck for sunset views.",
    price: "₹5.2 Cr",
    location: "Sector 65, Gurugram, Haryana",
    type: "Villa",
    category: "Residential",
    bhk: 4,
    size: "3800 sqft",
    status: "Ready to Move",
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Private Pool", "Garden Access", "Outdoor Kitchen", "Security"],
    featured: 1
  },
  {
    id: 103,
    title: "Tech Park One",
    description: "Strategically located in the IT hub, this Grade A commercial building offers flexible office spaces with high-speed connectivity and modern infrastructure.",
    price: "₹12 Cr",
    location: "Cyber City, Gurugram, Haryana",
    type: "Commercial",
    category: "Commercial",
    bhk: 0,
    size: "8500 sqft",
    status: "Available",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Fiber Optic", "Food Court", "Ample Parking", "24/7 Power"],
    featured: 1
  },
  {
    id: 104,
    title: "Green Acres Plots",
    description: "Invest in your future with premium residential plots in a gated community. Surrounded by lush greenery and planned infrastructure.",
    price: "₹85 L",
    location: "Sohna Road, Gurugram, Haryana",
    type: "Plot",
    category: "Residential",
    bhk: 0,
    size: "2400 sqft",
    status: "New Launch",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Gated Community", "Clubhouse", "Water Supply", "Paved Roads"],
    featured: 0
  },
  {
    id: 105,
    title: "The Zenith Tower",
    description: "An iconic landmark offering premium retail and office spaces. High footfall location with excellent visibility and modern architecture.",
    price: "₹18 Cr",
    location: "Golf Course Road, Gurugram, Haryana",
    type: "Commercial",
    category: "Commercial",
    bhk: 0,
    size: "12000 sqft",
    status: "Ready to Move",
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Central AC", "Valet Parking", "High-speed Lifts", "CCTV"],
    featured: 0
  },
  {
    id: 106,
    title: "Heritage Square",
    description: "Modern apartments with a touch of traditional architecture. Located in a quiet neighborhood with easy access to schools and hospitals.",
    price: "₹1.5 Cr",
    location: "Sector 102, Gurugram, Haryana",
    type: "Apartment",
    category: "Residential",
    bhk: 2,
    size: "1450 sqft",
    status: "Ready to Move",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"],
    amenities: ["Community Hall", "Children's Play Area", "Gym", "Power Backup"],
    featured: 0
  }
];

app.post("/api/admin/verify", (req, res) => {
  const { password } = req.body;
  if (password && password.trim() === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

app.get("/api/properties", async (req, res) => {
  const { type, category, location } = req.query;

  if (!supabase) {
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
  if (!password || password.trim() !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!supabase) {
    return res.status(500).json({ 
      error: "Database not connected", 
      message: "Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your Vercel Project Settings." 
    });
  }

  const { data, error } = await supabase
    .from("properties")
    .insert([propertyData])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data && data.length > 0 ? data[0] : { success: true });
});

app.delete("/api/properties/:id", async (req, res) => {
  const { password } = req.body;
  if (!password || password.trim() !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!supabase) {
    return res.status(500).json({ 
      error: "Database not connected", 
      message: "Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your Vercel Project Settings." 
    });
  }

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.post("/api/inquiries", async (req, res) => {
  if (!supabase) return res.status(201).json({ success: true });

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
  if (!supabase) return res.json([]);
  const { data, error } = await supabase.from("testimonials").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 404 handler for API
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
