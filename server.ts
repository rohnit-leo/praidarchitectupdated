import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { PROJECTS_DATA } from "./src/data/projects";

const app = express();
const PORT = 3000;

// Increase payload limits for base64 direct image uploads from admin panel
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Server-side permanent storage file paths
const SERVER_DATA_DIR = path.join(process.cwd(), "server-data");
const PROJECTS_FILE = path.join(SERVER_DATA_DIR, "projects-store.json");
const SETTINGS_FILE = path.join(SERVER_DATA_DIR, "settings-store.json");

function ensureServerData() {
  try {
    if (!fs.existsSync(SERVER_DATA_DIR)) {
      fs.mkdirSync(SERVER_DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PROJECTS_FILE)) {
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(PROJECTS_DATA, null, 2), "utf-8");
    }
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(
        SETTINGS_FILE,
        JSON.stringify(
          {
            googleVerificationCode: "google5c5874fddee15bd4",
            adminPassword: "priadadmin",
            passwordUpdatedAt: Date.now(),
            updatedAt: Date.now(),
          },
          null,
          2
        ),
        "utf-8"
      );
    }
  } catch (err) {
    console.error("Error initializing server-data storage:", err);
  }
}

function readStoredProjects(): any[] {
  ensureServerData();
  try {
    const raw = fs.readFileSync(PROJECTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading projects-store.json:", err);
    return PROJECTS_DATA;
  }
}

function writeStoredProjects(projects: any[]): void {
  ensureServerData();
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

function readStoredSettings(): Record<string, any> {
  ensureServerData();
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.adminPassword) {
      parsed.adminPassword = "priadadmin";
    }
    return parsed;
  } catch (err) {
    return { googleVerificationCode: "google5c5874fddee15bd4", adminPassword: "priadadmin" };
  }
}

function writeStoredSettings(settings: Record<string, any>): void {
  ensureServerData();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

// Google Search Console Site Verification HTML file route
app.get("/google5c5874fddee15bd4.html", (req, res) => {
  res.header("Content-Type", "text/html");
  res.send("google-site-verification: google5c5874fddee15bd4.html");
});

// Initialize Gemini Client Lazily if key present
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", studio: "PRIAD ARCHITECTS", timestamp: new Date().toISOString() });
});

// --- Server-Side Permanent Projects API ---
app.get("/api/projects", (req, res) => {
  const projects = readStoredProjects();
  res.json({ success: true, projects });
});

app.post("/api/projects", (req, res) => {
  try {
    const incoming = req.body.project || req.body;
    if (!incoming || !incoming.id) {
      return res.status(400).json({ success: false, error: "Project must contain an 'id'" });
    }

    const currentList = readStoredProjects();
    const existingIndex = currentList.findIndex((p: any) => p.id === incoming.id);
    const now = Date.now();
    const updatedProject = {
      ...incoming,
      updatedAt: now,
      createdAt: incoming.createdAt || now,
    };

    if (existingIndex >= 0) {
      currentList[existingIndex] = updatedProject;
    } else {
      currentList.unshift(updatedProject);
    }

    writeStoredProjects(currentList);
    console.log(`[SERVER STORE] Project "${updatedProject.title}" (${updatedProject.id}) permanently saved.`);
    res.json({ success: true, project: updatedProject, projects: currentList });
  } catch (err: any) {
    console.error("Failed to save project on server:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to persist project" });
  }
});

app.delete("/api/projects/:id", (req, res) => {
  try {
    const { id } = req.params;
    const currentList = readStoredProjects();
    const filtered = currentList.filter((p: any) => p.id !== id);
    writeStoredProjects(filtered);
    console.log(`[SERVER STORE] Project ${id} permanently deleted.`);
    res.json({ success: true, deletedId: id, projects: filtered });
  } catch (err: any) {
    console.error("Failed to delete project on server:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to delete project" });
  }
});

app.post("/api/projects/reset", (req, res) => {
  try {
    writeStoredProjects(PROJECTS_DATA);
    console.log("[SERVER STORE] Projects reset to default.");
    res.json({ success: true, projects: PROJECTS_DATA });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Server-Side Permanent Site Settings & SEO API ---
app.get("/api/settings", (req, res) => {
  const settings = readStoredSettings();
  res.json({ success: true, settings });
});

app.post("/api/settings", (req, res) => {
  try {
    const prev = readStoredSettings();
    const next = { ...prev, ...req.body, updatedAt: Date.now() };
    writeStoredSettings(next);
    console.log("[SERVER STORE] Site settings permanently updated.");
    res.json({ success: true, settings: next });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Admin Password Security API ---
app.post("/api/admin/verify-password", (req, res) => {
  const { password } = req.body || {};
  const settings = readStoredSettings();
  const currentPassword = settings.adminPassword || "priadadmin";
  const isValid = typeof password === "string" && password.trim() === currentPassword;
  res.json({ success: true, valid: isValid });
});

app.post("/api/admin/change-password", (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 3) {
      return res.status(400).json({ success: false, error: "New password must be at least 3 characters." });
    }

    const settings = readStoredSettings();
    const activePassword = settings.adminPassword || "priadadmin";

    // If current password is provided, verify it
    if (currentPassword !== undefined && currentPassword !== null && currentPassword.trim() !== activePassword) {
      return res.status(401).json({ success: false, error: "Current password does not match." });
    }

    settings.adminPassword = newPassword.trim();
    settings.passwordUpdatedAt = Date.now();
    writeStoredSettings(settings);

    console.log("[SERVER STORE] Admin password successfully changed.");
    res.json({ success: true, message: "Administrator password changed successfully." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to change password." });
  }
});

app.post("/api/admin/reset-password", (req, res) => {
  try {
    const settings = readStoredSettings();
    settings.adminPassword = "priadadmin";
    settings.passwordUpdatedAt = Date.now();
    writeStoredSettings(settings);
    console.log("[SERVER STORE] Admin password reset to default 'priadadmin'.");
    res.json({ success: true, message: "Password reset to default 'priadadmin'." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Dynamic XML Sitemap for SEO
app.get("/sitemap.xml", (req, res) => {
  const baseUrl = process.env.APP_URL || "https://www.priadarchitects.in";
  const pages = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/process",
    "/floorplan-explorer",
    "/before-after",
    "/material-studio",
    "/3d-layer-viewer",
    "/calculator",
    "/manifesto",
    "/blog",
    "/testimonials",
    "/faq",
    "/contact",
    "/seo-technical"
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (p) => `
  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === "" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
});

// Google Search Console Site Verification File route
app.get("/google5c5874fddee15bd4.html", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send("google-site-verification: google5c5874fddee15bd4.html");
});

// Dynamic Robots.txt for SEO
app.get("/robots.txt", (req, res) => {
  const baseUrl = process.env.APP_URL || "https://www.priadarchitects.in";
  const content = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header("Content-Type", "text/plain");
  res.send(content);
});

// AI Design Thinking & Architecture Assistant API Route
app.post("/api/ai-design-assistant", async (req, res) => {
  try {
    const { projectType, areaSqFt, architecturalStyle, location, budgetLevel, userPrompt } = req.body;

    const ai = getGeminiClient();
    const systemPrompt = `You are PRIAD ARCHITECTS' Principal Design Director AI. 
Provide a bespoke, high-end architectural concept assessment, spatial recommendation, structural engineering highlights, and material choices.
Keep the tone exceptionally authoritative, luxury-focused, precise, and visionary.
Output JSON with the following structure:
{
  "conceptTitle": "String - luxury architectural concept title",
  "designPhilosophy": "String - 2 sentences of design strategy",
  "recommendedMaterials": ["Array of 4 luxury materials with short rationale"],
  "spatialHighlights": ["Array of 3 spatial design features"],
  "sustainabilityFeatures": ["Array of 2 eco-engineering solutions"],
  "estimatedTimelineMonths": "String or Number",
  "keyArchitecturalInsight": "String - compelling advice"
}`;

    const promptText = `Client Request Details:
- Project Category: ${projectType || 'Ultra-Luxury Residence'}
- Approx Footprint: ${areaSqFt || 5500} Sq Ft
- Preferred Aesthetic: ${architecturalStyle || 'Modern Brutalist Minimalism'}
- Site Context/Location: ${location || 'Coastal / Urban Sloped Terrain'}
- Investment Scope: ${budgetLevel || 'Ultra-Premium Tier'}
- Client Notes: ${userPrompt || 'Looking for seamless indoor-outdoor integration with cantilevered concrete forms, floor-to-ceiling double-glazed thermal glass, and sustainable geothermal cooling.'}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty AI response");
    }

    const data = JSON.parse(resultText);
    res.json({ success: true, analysis: data });
  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate architectural analysis",
      fallback: {
        conceptTitle: "Monolithic Cantilever Residence",
        designPhilosophy: "Harmonizing raw structural concrete with double-height structural glass curtains to merge natural topography with refined minimalism.",
        recommendedMaterials: [
          "Board-formed architectural concrete with hydrophobic sealant",
          "Thermally broken triple-glazed low-E ultra-clear glass",
          "Charred Japanese Shou Sugi Ban Yakisugi cedar paneling",
          "Honed Volakas marble slabs with integrated brass reveals"
        ],
        spatialHighlights: [
          "Floating cantilevered upper storey with 14m column-free span",
          "Sunken amphitheater courtyard with infinity water reflection basin",
          "Hidden subterranean climate-controlled subterranean gallery"
        ],
        sustainabilityFeatures: [
          "Passive solar orientation with deep roof overhangs",
          "Rainwater harvesting integrated into foundational retention vaults"
        ],
        estimatedTimelineMonths: "14 - 18 Months",
        keyArchitecturalInsight: "By raising the primary living pavilion above the slope, we capture unblocked panoramic views while optimizing cross-ventilation flow."
      }
    });
  }
});

// Consultation Submission Handler + WhatsApp Payload Formatter
app.post("/api/consultation", (req, res) => {
  const { name, phone, email, projectType, location, budget, timeline, notes } = req.body;

  const whatsappPhone = "919150073342"; // Official PRIAD WhatsApp target line (9150073342)
  const formattedMsg = `*PRIAD ARCHITECTS - NEW PROJECT CONSULTATION ENQUIRY*
----------------------------------------
👤 *Client Name:* ${name || 'N/A'}
📞 *Phone:* ${phone || 'N/A'}
✉️ *Email:* ${email || 'N/A'}
🏛️ *Project Category:* ${projectType || 'General Architecture'}
📍 *Location:* ${location || 'Not Specified'}
💰 *Budget Range:* ${budget || 'Flexible'}
⏱️ *Timeline:* ${timeline || 'Immediate'}
📝 *Project Scope:* ${notes || 'Standard Initial Discovery'}
----------------------------------------
Sent via PRIAD Digital Studio Portal`;

  const encodedMsg = encodeURIComponent(formattedMsg);
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMsg}`;

  res.json({
    success: true,
    message: "Consultation enquiry received successfully.",
    whatsappUrl,
    summary: { name, projectType, location }
  });
});

async function startServer() {
  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Explicitly handle /admin directly before general static files
    app.get(["/admin", "/admin/*", "/admin.html"], (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PRIAD ARCHITECTS Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
