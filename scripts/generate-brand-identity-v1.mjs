/**
 * Brand Identity v1.0 — generate PNG exports + Brand Guidelines PDF.
 * No business logic / backend / schema changes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const { jsPDF } = require("jspdf");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const pack = path.join(root, "brand-assets", "identity-v1.0");
const exportsDir = path.join(pack, "exports");
const pngDir = path.join(exportsDir, "png");
const publicBrand = path.join(root, "public", "brand", "v1");

const COLORS = {
  ink: "#0A1628",
  harbor: "#0E4D5C",
  signal: "#0F766E",
  signalBright: "#14B8A6",
  mist: "#F1F5F9",
  cloud: "#F8FAFC",
  steel: "#64748B",
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function walkSvg(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkSvg(full));
    else if (entry.name.endsWith(".svg")) out.push(full);
  }
  return out;
}

async function rasterize(svgPath, outPng, width) {
  // Strip XML-illegal control chars (e.g. corrupted em dashes) before librsvg parse.
  const cleaned = fs
    .readFileSync(svgPath, "utf8")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  await sharp(Buffer.from(cleaned, "utf8"), { density: 300 })
    .resize({ width, withoutEnlargement: false })
    .png()
    .toFile(outPng);
}

async function exportPngs() {
  ensureDir(pngDir);
  const specs = [
    { rel: "logos/monogram-light.svg", w: 512 },
    { rel: "logos/monogram-dark.svg", w: 512 },
    { rel: "logos/primary-horizontal-light.svg", w: 1600 },
    { rel: "logos/primary-horizontal-dark.svg", w: 1600 },
    { rel: "logos/primary-stacked-light.svg", w: 1024 },
    { rel: "logos/primary-stacked-dark.svg", w: 1024 },
    { rel: "logos/secondary-horizontal.svg", w: 1400 },
    { rel: "logos/app-icon.svg", w: 1024 },
    { rel: "logos/favicon.svg", w: 64 },
    { rel: "logos/favicon.svg", w: 32, name: "favicon-32.png" },
    { rel: "logos/favicon.svg", w: 16, name: "favicon-16.png" },
    { rel: "social/social-avatar.svg", w: 800 },
    { rel: "social/linkedin-banner.svg", w: 1584 },
    { rel: "presentations/title-slide.svg", w: 1920 },
    { rel: "presentations/content-slide.svg", w: 1920 },
    { rel: "guidelines/logo-do-dont.svg", w: 1200 },
  ];

  const written = [];
  for (const spec of specs) {
    const src = path.join(pack, spec.rel);
    if (!fs.existsSync(src)) {
      console.warn("skip missing", spec.rel);
      continue;
    }
    const base = spec.name || `${path.basename(spec.rel, ".svg")}.png`;
    const dest = path.join(pngDir, base);
    await rasterize(src, dest, spec.w);
    written.push(base);
    console.log("png", base, `(${spec.w}px)`);
  }
  return written;
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function writeGuidelinesPdf() {
  ensureDir(exportsDir);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const m = 18;
  const maxW = W - m * 2;
  const ink = hexToRgb(COLORS.ink);
  const signal = hexToRgb(COLORS.signal);
  const steel = hexToRgb(COLORS.steel);

  function footer(page) {
    doc.setFontSize(8);
    doc.setTextColor(...steel);
    doc.setFont("helvetica", "normal");
    doc.text("Arjun Automation · Brand Identity v1.0 · Confidential", m, H - 10);
    doc.text(String(page), W - m, H - 10, { align: "right" });
  }

  function heading(text, y) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...ink);
    doc.text(text, m, y);
    return y + 8;
  }

  function body(text, y, size = 10) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...ink);
    const lines = doc.splitTextToSize(text, maxW);
    for (const line of lines) {
      if (y > H - 22) {
        footer(doc.internal.getNumberOfPages());
        doc.addPage();
        y = m;
      }
      doc.text(line, m, y);
      y += size * 0.45 + 1.2;
    }
    return y + 2;
  }

  function bullet(items, y) {
    for (const item of items) {
      y = body(`•  ${item}`, y, 10);
    }
    return y + 2;
  }

  // Cover
  doc.setFillColor(...ink);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(...signal);
  doc.circle(W - 20, 30, 55, "F");
  doc.setFillColor(...hexToRgb(COLORS.signalBright));
  doc.circle(24, H - 20, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("BRAND IDENTITY SYSTEM", m, 70);
  doc.setFontSize(28);
  doc.text("Arjun Automation", m, 92);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Precision Orbit  ·  Version 1.0", m, 108);
  doc.setFontSize(11);
  doc.setTextColor(...hexToRgb("#94A3B8"));
  doc.text("Enterprise automation, orchestrated.", m, 124);
  doc.setFontSize(9);
  doc.text("Official brand book  ·  Logo · Color · Type · Usage", m, H - 28);
  footer(1);

  // Strategy
  doc.addPage();
  let y = m;
  y = heading("1. Brand Strategy", y);
  y = body("Mission", y, 11);
  y = body(
    "Give every organization an enterprise operating system — AI-native, secure by default, and fast to value — so teams run strategy while automation runs the work.",
    y,
  );
  y = body("Vision", y, 11);
  y = body(
    "A durable standard for how modern companies operate: one platform, clear outcomes, continuous intelligence.",
    y,
  );
  y = body("Values", y, 11);
  y = bullet(
    [
      "Outcome over output — Measure client results, not activity volume.",
      "Platform thinking — Configure once; scale without bespoke debt.",
      "Security first — Tenant isolation, auditability, governance.",
      "Radical clarity — Plain language, honest timelines.",
      "Partnership — Success measured after go-live.",
    ],
    y,
  );
  y = body("Voice: Precise · Calm · Confident · Human · Evidence-led", y);
  y = body("Personality: Intelligent · Premium · Trustworthy · Timeless · Operational · Minimal", y);
  y = body("Tagline: Enterprise automation, orchestrated.", y);
  footer(2);

  // Logo
  doc.addPage();
  y = m;
  y = heading("2. Logo System — Orbit Mark", y);
  y = body(
    "The Orbit Mark combines an ascending A geometry with a signal-teal orbital arc. It reads as precision, motion, and continuous operation — suitable for SaaS, AI, and enterprise buyers.",
    y,
  );
  y = body("Variants", y, 11);
  y = bullet(
    [
      "Primary horizontal (light / dark)",
      "Primary stacked (light / dark)",
      "Secondary horizontal wordmark",
      "Monogram / icon (light / dark)",
      "App icon + favicon",
    ],
    y,
  );
  y = body("Clear space: equal to the height of the Orbit Mark letter cap.", y);
  y = body("Minimum size: horizontal 128px digital / 35mm print; monogram 24px / 8mm.", y);
  y = body("Do", y, 11);
  y = bullet(
    [
      "Use approved SVG/PNG masters from the Asset Export Pack",
      "Prefer light logos on mist/cloud; dark logos on ink",
      "Keep clear space free of type, photos, and UI chrome",
    ],
    y,
  );
  y = body("Don't", y, 11);
  y = bullet(
    [
      "Recolor outside ink / signal / white",
      "Stretch, rotate, outline, or add drop shadows",
      "Place on busy photography without a dark scrim",
      "Rebuild the wordmark in non-brand typefaces",
    ],
    y,
  );
  footer(3);

  // Color + type
  doc.addPage();
  y = m;
  y = heading("3. Design System", y);
  y = body("Official color palette", y, 11);

  const swatches = [
    ["Ink", COLORS.ink],
    ["Harbor", COLORS.harbor],
    ["Signal", COLORS.signal],
    ["Signal Bright", COLORS.signalBright],
    ["Mist", COLORS.mist],
    ["Cloud", COLORS.cloud],
    ["Steel", COLORS.steel],
  ];
  let x = m;
  const swY = y;
  for (const [name, hex] of swatches) {
    const rgb = hexToRgb(hex);
    doc.setFillColor(...rgb);
    doc.roundedRect(x, swY, 22, 14, 2, 2, "F");
    doc.setFontSize(7);
    doc.setTextColor(...ink);
    doc.text(name, x, swY + 18);
    doc.setTextColor(...steel);
    doc.text(hex, x, swY + 22);
    x += 25;
    if (x > W - 30) {
      x = m;
    }
  }
  y = swY + 30;
  y = body("Typography: Geist Sans (display/body), Geist Mono (code).", y);
  y = body("Scale: Display 3rem → Label 0.75rem. Tracking tight on display (−0.03em).", y);
  y = body("Grid & spacing: 4px base unit · 12-column content · max width 72rem.", y);
  y = body(
    "Iconography: geometric arcs and nodes; 1.5–2.5px strokes at 24px; limited palette; no skeuomorphism.",
    y,
  );
  y = body(
    "Illustration: systems diagrams with soft depth — arcs, nodes, orbit motifs. Avoid purple-default gradients and generic stock collage.",
    y,
  );
  footer(4);

  // Digital assets + governance
  doc.addPage();
  y = m;
  y = heading("4. Digital Assets", y);
  y = bullet(
    [
      "Favicon (SVG + 16/32/64 PNG)",
      "App icon (1024 PNG)",
      "Social profile avatar + LinkedIn banner",
      "Email signature HTML template",
      "Presentation title + content slide templates",
    ],
    y,
  );
  y = heading("5. Governance", y);
  y = body(
    "All product, marketing, partner, and sales materials must use Brand Identity v1.0 assets from brand-assets/identity-v1.0. Do not invent alternate marks or palettes.",
    y,
  );
  y = body("Contact: brand@arjunautomations.com", y);
  y = body("Pack location: brand-assets/identity-v1.0 · Public mirror: public/brand/v1", y);
  footer(5);

  const pdfPath = path.join(exportsDir, "Brand-Identity-v1.0-Guidelines.pdf");
  doc.save(pdfPath);
  console.log("pdf", pdfPath);
  return pdfPath;
}

function mirrorPublic() {
  ensureDir(publicBrand);
  const dirs = ["logos", "social", "templates", "presentations", "exports", "guidelines"];
  for (const d of dirs) {
    const src = path.join(pack, d);
    const dest = path.join(publicBrand, d);
    if (!fs.existsSync(src)) continue;
    ensureDir(dest);
    copyRecursive(src, dest);
  }
  // Root docs
  for (const f of ["BRAND_GUIDELINES.md", "README.md", "MANIFEST.json"]) {
    const src = path.join(pack, f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(publicBrand, f));
  }
  console.log("mirrored", publicBrand);
}

function copyRecursive(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
}

function writeManifest(pngs, pdfPath) {
  const svgs = walkSvg(pack).map((p) => path.relative(pack, p).replace(/\\/g, "/"));
  const manifest = {
    version: "1.0.0",
    name: "Arjun Automation Brand Identity",
    codename: "Precision Orbit",
    generatedAt: new Date().toISOString(),
    deliverables: [
      "Brand Identity v1.0",
      "Brand Guidelines PDF",
      "Asset Export Pack",
    ],
    colors: COLORS,
    svg: svgs,
    png: pngs,
    pdf: path.relative(pack, pdfPath).replace(/\\/g, "/"),
    publicMirror: "public/brand/v1",
  };
  const dest = path.join(pack, "MANIFEST.json");
  fs.writeFileSync(dest, JSON.stringify(manifest, null, 2));
  console.log("manifest", dest);
  return manifest;
}

async function main() {
  console.log("Brand Identity v1.0 export…");
  const pngs = await exportPngs();
  const pdfPath = writeGuidelinesPdf();
  const manifest = writeManifest(pngs, pdfPath);
  mirrorPublic();
  console.log("done", manifest.deliverables.join(" · "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

