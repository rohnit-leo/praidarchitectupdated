import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Dynamic XML Sitemap for SEO
app.get("/sitemap.xml", (req, res) => {
  const baseUrl = process.env.APP_URL || "https://priadarchitects.com";
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

// Dynamic Robots.txt for SEO
app.get("/robots.txt", (req, res) => {
  const baseUrl = process.env.APP_URL || "https://priadarchitects.com";
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

  const whatsappPhone = "919876543210"; // Official PRIAD WhatsApp target line
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
