import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import cors from "cors";
import session from "express-session";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Trust proxy for secure cookies in AI Studio/Cloud Run
app.set("trust proxy", 1);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "mmw-watches-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" || true, // Always true for sameSite: none
    sameSite: "none",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Ensure data and uploads directories exist
const DATA_DIR = path.resolve(process.cwd(), "data");
const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
const WATCHES_FILE = path.resolve(DATA_DIR, "watches.json");

console.log("UPLOADS_DIR path:", UPLOADS_DIR);

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}
// Ensure uploads directory is writable
try {
  fs.chmodSync(UPLOADS_DIR, 0o777);
} catch (e) {
  console.error("Failed to chmod uploads directory:", e);
}
if (!fs.existsSync(WATCHES_FILE)) {
  fs.writeFileSync(WATCHES_FILE, JSON.stringify([
    {
      id: "1",
      name: "Royal Oak Selfwinding",
      brand: "Audemars Piguet",
      price: 45000,
      type: "Sport",
      description: "The Royal Oak Selfwinding in stainless steel with a blue 'Grande Tapisserie' dial.",
      specs: {
        movement: "Calibre 4302",
        material: "Stainless Steel",
        powerReserve: "70 hours",
        waterResistance: "50m"
      },
      images: ["https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800"]
    },
    {
      id: "2",
      name: "Submariner Date",
      brand: "Rolex",
      price: 12500,
      type: "Sport",
      description: "The Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert in black ceramic.",
      specs: {
        movement: "Calibre 3235",
        material: "Oystersteel",
        powerReserve: "70 hours",
        waterResistance: "300m"
      },
      images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800"]
    },
    {
      id: "3",
      name: "Nautilus 5711/1A",
      brand: "Patek Philippe",
      price: 120000,
      type: "Classic",
      description: "With the rounded octagonal shape of its bezel, the ingenious porthole construction of its case, and its horizontally embossed dial.",
      specs: {
        movement: "Calibre 26-330 S C",
        material: "Steel",
        powerReserve: "45 hours",
        waterResistance: "120m"
      },
      images: ["https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&q=80&w=800"]
    }
  ], null, 2));
}

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

// Test route for uploads
app.get("/uploads/test-static", (req, res) => {
  res.send("Static serving is working");
});

// Debug route to list uploads
app.get("/api/debug/uploads", (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    res.json({ uploads: files, dir: UPLOADS_DIR });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Auth Middleware
const requireAuth = (req: any, res: any, next: any) => {
  console.log("Auth check - Session ID:", req.sessionID, "IsAuthenticated:", req.session.isAuthenticated);
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Auth Routes
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password === adminPassword) {
    (req.session as any).isAuthenticated = true;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ success: false, message: "Session error" });
      }
      res.json({ success: true });
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

app.get("/api/check-auth", (req, res) => {
  if ((req.session as any).isAuthenticated) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Multer config for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API Routes
app.get("/api/watches", (req, res) => {
  const data = JSON.parse(fs.readFileSync(WATCHES_FILE, "utf-8"));
  res.json(data);
});

app.post("/api/watches", requireAuth, (req, res) => {
  const data = JSON.parse(fs.readFileSync(WATCHES_FILE, "utf-8"));
  const newWatch = { ...req.body, id: Date.now().toString() };
  data.push(newWatch);
  fs.writeFileSync(WATCHES_FILE, JSON.stringify(data, null, 2));
  res.status(201).json(newWatch);
});

app.put("/api/watches/:id", requireAuth, (req, res) => {
  const data = JSON.parse(fs.readFileSync(WATCHES_FILE, "utf-8"));
  const index = data.findIndex((w: any) => w.id === req.params.id);
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    fs.writeFileSync(WATCHES_FILE, JSON.stringify(data, null, 2));
    res.json(data[index]);
  } else {
    res.status(404).json({ message: "Watch not found" });
  }
});

app.delete("/api/watches/:id", requireAuth, (req, res) => {
  let data = JSON.parse(fs.readFileSync(WATCHES_FILE, "utf-8"));
  data = data.filter((w: any) => w.id !== req.params.id);
  fs.writeFileSync(WATCHES_FILE, JSON.stringify(data, null, 2));
  res.status(204).send();
});

app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
  console.log("Upload request received:", req.file ? "File present" : "No file");
  if (req.file) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(req.file.originalname);
    const filePath = path.join(UPLOADS_DIR, filename);
    
    try {
      fs.writeFileSync(filePath, req.file.buffer);
      console.log("File saved successfully to:", filePath);
      const url = `/uploads/${filename}`;
      res.json({ url });
    } catch (error) {
      console.error("Failed to save file:", error);
      res.status(500).json({ message: "Failed to save file on server" });
    }
  } else {
    console.log("No file uploaded in request");
    res.status(400).json({ message: "No file uploaded" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
