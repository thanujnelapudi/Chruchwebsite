/**
 * seed-from-csv.ts — fixed CSV parser handles multi-line quoted fields
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

// ── Proper CSV parser — handles multi-line quoted fields ──────────────────────
function parseCSV(filePath: string): Record<string, string>[] {
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, ""); // strip BOM

  const records: string[][] = [];
  let currentRecord: string[] = [];
  let currentField = "";
  let inQuotes = false;
  let i = 0;

  while (i < raw.length) {
    const ch  = raw[i];
    const next = raw[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        // Escaped quote inside quoted field
        currentField += '"';
        i += 2;
      } else if (ch === '"') {
        // End of quoted field
        inQuotes = false;
        i++;
      } else {
        // Regular character inside quotes (including newlines)
        currentField += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        currentRecord.push(currentField);
        currentField = "";
        i++;
      } else if (ch === '\r' && next === '\n') {
        // Windows line ending
        currentRecord.push(currentField);
        currentField = "";
        if (currentRecord.some(f => f.trim() !== "")) {
          records.push(currentRecord);
        }
        currentRecord = [];
        i += 2;
      } else if (ch === '\n' || ch === '\r') {
        currentRecord.push(currentField);
        currentField = "";
        if (currentRecord.some(f => f.trim() !== "")) {
          records.push(currentRecord);
        }
        currentRecord = [];
        i++;
      } else {
        currentField += ch;
        i++;
      }
    }
  }

  // Handle last field/record
  if (currentField || currentRecord.length > 0) {
    currentRecord.push(currentField);
    if (currentRecord.some(f => f.trim() !== "")) {
      records.push(currentRecord);
    }
  }

  if (records.length < 2) return [];

  const headers = records[0].map(h => h.trim());
  return records.slice(1)
    .filter(row => row.some(f => f.trim() !== ""))  // skip blank rows
    .filter(row => row[0]?.trim() !== "")           // skip rows with no song title
    .map(row => Object.fromEntries(
      headers.map((h, idx) => [h, (row[idx] ?? "").trim()])
    ));
}

// ── Delete all existing songs (clean slate before reseed) ─────────────────────
async function deleteExistingSongs() {
  console.log("🗑   Deleting existing songs from Sanity...");
  const existing: Array<{_id: string}> = await client.fetch(
    `*[_type == "song"] { _id }`
  );
  if (existing.length === 0) {
    console.log("    No existing songs to delete.");
    return;
  }
  const transaction = client.transaction();
  existing.forEach(doc => transaction.delete(doc._id));
  await transaction.commit();
  console.log(`    Deleted ${existing.length} existing songs.`);
}

// ── Delete all existing service schedules ────────────────────────────────────
async function deleteExistingSchedules() {
  console.log("🗑   Deleting existing service schedule entries...");
  const existing: Array<{_id: string}> = await client.fetch(
    `*[_type == "serviceSchedule"] { _id }`
  );
  if (existing.length === 0) {
    console.log("    No existing entries to delete.");
    return;
  }
  const transaction = client.transaction();
  existing.forEach(doc => transaction.delete(doc._id));
  await transaction.commit();
  console.log(`    Deleted ${existing.length} existing entries.`);
}

// ── Seed Service Schedule ─────────────────────────────────────────────────────
async function seedServiceSchedule() {
  const csvPath = path.resolve(__dirname, "../../Service_Schedule.csv");
  if (!fs.existsSync(csvPath)) {
    // Try underscore variant
    const altPath = path.resolve(__dirname, "../../Service+Schedule.csv");
    if (!fs.existsSync(altPath)) {
      console.warn("⚠   Service_Schedule.csv not found — skipping.");
      return;
    }
  }
  const actualPath = fs.existsSync(path.resolve(__dirname, "../../Service_Schedule.csv"))
    ? path.resolve(__dirname, "../../Service_Schedule.csv")
    : path.resolve(__dirname, "../../Service+Schedule.csv");

  const rows = parseCSV(actualPath);
  console.log(`📋  Seeding ${rows.length} service schedule entries...`);

  const transaction = client.transaction();
  rows.forEach((row, idx) => {
    transaction.createOrReplace({
      _type: "serviceSchedule",
      _id: `serviceSchedule-${row["ID"] || idx}`,
      serviceName: row["Service Name"] || "",
      dayOfWeek:   row["Day of the Week"] || "",
      serviceTime: row["Service Time"] || "",
      description: row["Description"] || "",
      location:    row["Location"] || "The Pillar of Cloud Tabernacle",
      isOnline:    row["Is Online"]?.toLowerCase() === "true",
      sortOrder:   idx + 1,
    });
  });
  await transaction.commit();
  console.log("✅  Service schedule seeded.");
}

// ── Seed Songs ────────────────────────────────────────────────────────────────
async function seedSongs() {
  const csvPath = fs.existsSync(path.resolve(__dirname, "../../Worship_Songs.csv"))
    ? path.resolve(__dirname, "../../Worship_Songs.csv")
    : path.resolve(__dirname, "../../Worship+Songs.csv");

  if (!fs.existsSync(csvPath)) {
    console.warn("⚠   Worship_Songs.csv not found — skipping.");
    return;
  }

  const rows = parseCSV(csvPath);
  console.log(`🎵  Seeding ${rows.length} worship songs...`);

  const transaction = client.transaction();
  let seeded = 0;

  rows.forEach((row, idx) => {
    const title  = row["Song Title"]?.trim();
    if (!title) return;  // skip rows without a title

    const lyrics    = row["Lyrics"]?.trim() || undefined;
    const artist    = row["Artist/Composer"]?.trim() || undefined;
    const genre     = row["Genre"]?.trim() || undefined;
    const audioLink = row["Audio Playback Link"]?.trim() || undefined;
    const id        = row["ID"]?.trim() || String(idx);

    const hasTelugu = /[\u0C00-\u0C7F]/.test((title ?? "") + (lyrics ?? ""));

    const doc: Record<string, unknown> = {
      _type: "song",
      _id:   `song-${id}`,
      title,
      lyrics,
      artist,
      genre:     genre || (hasTelugu ? "Telugu Worship" : "Praise & Worship"),
      audioLink,
      tags:      hasTelugu ? ["Telugu"] : [],
    };

    if (hasTelugu) doc.titleTelugu = title;

    // Remove undefined fields
    Object.keys(doc).forEach(k => doc[k] === undefined && delete doc[k]);

    transaction.createOrReplace(doc as Parameters<typeof transaction.createOrReplace>[0]);
    seeded++;
  });

  await transaction.commit();
  console.log(`✅  ${seeded} worship songs seeded.`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🚀  PCT Church — Sanity seed script (fixed CSV parser)");
  console.log("   Project:", PROJECT_ID);

  if (WRITE_TOKEN === "PASTE_YOUR_EDITOR_TOKEN_HERE") {
    console.error("\n❌  Paste your Editor token into the WRITE_TOKEN variable.");
    process.exit(1);
  }

  // Clean slate — delete broken data first
  await deleteExistingSongs();
  await deleteExistingSchedules();

  // Reseed with correct parser
  await seedServiceSchedule();
  await seedSongs();

  console.log("\n🎉  Done! Open https://pct-church.sanity.studio to verify.\n");
}

main().catch(err => {
  console.error("❌  Failed:", err.message);
  process.exit(1);
});