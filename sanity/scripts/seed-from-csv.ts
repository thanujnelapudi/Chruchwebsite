/**
 * seed-from-csv.ts  — credentials hardcoded, no .env needed
 * Run from project root:  npx tsx sanity/scripts/seed-from-csv.ts
 */
import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── EDIT THESE TWO VALUES ─────────────────────────────────────────────────────
const PROJECT_ID  = "ip63ijbc";
const WRITE_TOKEN = "skdgdoZViywjp1AcvdYyjEi5ItF1UIytPt0VsVsUKxGf21dJinW8YVbmYF8Vw5zGXKMJ5z24lQKEKUQqLeqw8gnbHVkzpaQWyi8tXZVwuAkxod57LcWw9L1IbeTnDvPH0xdCIXY0khjVw5Dz78smUmJNqUVwGlp1SrqMP0bzgYGp1mSPXJM5";
// ─────────────────────────────────────────────────────────────────────────────

const client = createClient({
  projectId: PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: WRITE_TOKEN,
});

function parseCSV(filePath: string): Record<string, string>[] {
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] ?? "").trim()]));
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '"' && inQuotes && next === '"') { cur += '"'; i++; }
    else if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === "," && !inQuotes) { result.push(cur); cur = ""; }
    else { cur += ch; }
  }
  result.push(cur);
  return result;
}

async function seedServiceSchedule() {
  // Look for CSV in project root (two levels up from sanity/scripts/)
  const csvPath = path.resolve(__dirname, "../../Service_Schedule.csv");
  if (!fs.existsSync(csvPath)) {
    console.warn("⚠  Service_Schedule.csv not found at:", csvPath);
    console.warn("   Place it at C:\\PCT-church\\PCT-phase1\\Service_Schedule.csv");
    return;
  }
  const rows = parseCSV(csvPath);
  console.log(`📋  Seeding ${rows.length} service schedule entries...`);
  const transaction = client.transaction();
  rows.forEach((row, idx) => {
    transaction.createOrReplace({
      _type: "serviceSchedule",
      _id: `serviceSchedule-${row["ID"] || idx}`,
      serviceName: row["Service Name"] || "",
      dayOfWeek: row["Day of the Week"] || "",
      serviceTime: row["Service Time"] || "",
      description: row["Description"] || "",
      location: row["Location"] || "The Pillar of Cloud Tabernacle",
      isOnline: row["Is Online"]?.toLowerCase() === "true",
      sortOrder: idx + 1,
    });
  });
  await transaction.commit();
  console.log("✅  Service schedule seeded.");
}

async function seedSongs() {
  const csvPath = path.resolve(__dirname, "../../Worship_Songs.csv");
  if (!fs.existsSync(csvPath)) {
    console.warn("⚠  Worship_Songs.csv not found at:", csvPath);
    console.warn("   Place it at C:\\PCT-church\\PCT-phase1\\Worship_Songs.csv");
    return;
  }
  const rows = parseCSV(csvPath);
  console.log(`🎵  Seeding ${rows.length} worship songs...`);
  const transaction = client.transaction();
  rows.forEach((row, idx) => {
    const title  = row["Song Title"] || "";
    const lyrics = row["Lyrics"] || "";
    const hasTelugu = /[\u0C00-\u0C7F]/.test(title + lyrics);
    const doc: Record<string, unknown> = {
      _type: "song",
      _id: `song-${row["ID"] || idx}`,
      title,
      lyrics: lyrics || undefined,
      artist: row["Artist/Composer"] || undefined,
      genre: row["Genre"] || (hasTelugu ? "Telugu Worship" : "Praise & Worship"),
      audioLink: row["Audio Playback Link"] || undefined,
      tags: hasTelugu ? ["Telugu"] : [],
    };
    if (hasTelugu) doc.titleTelugu = title;
    // Remove undefined fields
    Object.keys(doc).forEach(k => doc[k] === undefined && delete doc[k]);
    transaction.createOrReplace(doc as Parameters<typeof transaction.createOrReplace>[0]);
  });
  await transaction.commit();
  console.log("✅  Worship songs seeded.");
}

async function main() {
  console.log("\n🚀  PCT Church — Sanity seed script");
  console.log("   Project:", PROJECT_ID);
  if (WRITE_TOKEN === "skdgdoZViywjp1AcvdYyjEi5ItF1UIytPt0VsVsUKxGf21dJinW8YVbmYF8Vw5zGXKMJ5z24lQKEKUQqLeqw8gnbHVkzpaQWyi8tXZVwuAkxod57LcWw9L1IbeTnDvPH0xdCIXY0khjVw5Dz78smUmJNqUVwGlp1SrqMP0bzgYGp1mSPXJM5") {
    console.error("\n❌  You need to paste your Editor token into the script.");
    console.error("   Open sanity/scripts/seed-from-csv.ts and replace PASTE_YOUR_EDITOR_TOKEN_HERE");
    process.exit(1);
  }
  await seedServiceSchedule();
  await seedSongs();
  console.log("\n🎉  Done! Open https://pct-church.sanity.studio to verify.\n");
}

main().catch(err => { console.error("❌  Failed:", err.message); process.exit(1); });