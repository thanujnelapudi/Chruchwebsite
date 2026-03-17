/**
 * src/lib/sanity.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Central Sanity client and all GROQ query helpers.
 * Import named functions (e.g. `getSermons`) in Astro pages for data fetching.
 * Import `sanityImage` in components that need to build image URLs.
 *
 * Environment variables required (see .env.example):
 *   SANITY_PROJECT_ID  — your Sanity project ID
 *   SANITY_DATASET     — usually "production"
 *   SANITY_API_TOKEN   — read-only token for server-side fetching
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// ─── Client ──────────────────────────────────────────────────────────────────

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID ?? "",
  dataset: import.meta.env.SANITY_DATASET ?? process.env.SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true, // cached responses — fine for read-only public data
  token: import.meta.env.SANITY_API_TOKEN ?? process.env.SANITY_API_TOKEN ?? "",
});

/** Write client — used ONLY in API routes (contact form, prayer requests). */
export const sanityWriteClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID ?? "",
  dataset: import.meta.env.SANITY_DATASET ?? process.env.SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: import.meta.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_WRITE_TOKEN ?? "",
});

// ─── Image URL builder ────────────────────────────────────────────────────────

const builder = imageUrlBuilder(sanityClient);

/**
 * Build an image URL from a Sanity image reference.
 * Usage: sanityImage(post.thumbnailImage).width(800).url()
 */
export function sanityImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

// ─── TypeScript interfaces ────────────────────────────────────────────────────

export interface Sermon {
  _id: string;
  _createdDate?: string;
  title: string;
  speaker: string;
  date: string;
  topic?: string;
  tags?: string[];
  series?: string;
  seriesPart?: number;
  youtubeVideoId?: string;
  pdfUrl?: string;
  thumbnailImage?: SanityImage;
  description?: string;
}

export interface Song {
  _id: string;
  title: string;
  titleTelugu?: string;
  lyrics?: string;
  artist?: string;
  genre?: string;
  tags?: string[];
  audioLink?: string;
}

export interface Event {
  _id: string;
  title: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  description?: string;
  eventImage?: SanityImage;
  isPublic?: boolean;
}

export interface ServiceSchedule {
  _id: string;
  serviceName: string;
  dayOfWeek?: string;
  serviceTime?: string;
  location?: string;
  description?: string;
  isOnline?: boolean;
  sortOrder?: number;
}

export interface LeadershipTeam {
  _id: string;
  name: string;
  role?: string;
  profilePhoto?: SanityImage;
  biography?: string;
  email?: string;
  socialMediaLink?: string;
  sortOrder?: number;
}

export interface GalleryItem {
  _id: string;
  title?: string;
  image: SanityImage;
  category?: string;
  caption?: string;
  dateTaken?: string;
}

export interface DailyVerse {
  _id: string;
  date: string;
  verseText?: string;
  verseReference?: string;
  verseImage?: SanityImage;
  language?: "en" | "te" | "both";
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// ─── GROQ query helpers ───────────────────────────────────────────────────────

const SERMON_FIELDS = `
  _id,
  title,
  speaker,
  date,
  topic,
  tags,
  series,
  seriesPart,
  youtubeVideoId,
  pdfUrl,
  description,
  thumbnailImage
`;

const SONG_FIELDS = `
  _id,
  title,
  titleTelugu,
  lyrics,
  artist,
  genre,
  tags,
  audioLink
`;

const EVENT_FIELDS = `
  _id,
  title,
  eventDate,
  eventTime,
  location,
  description,
  eventImage,
  isPublic
`;

// ── Sermons ──────────────────────────────────────────────────────────────────

/** Fetch all sermons, newest first. */
export async function getSermons(): Promise<Sermon[]> {
  return sanityClient.fetch(
    `*[_type == "sermon"] | order(date desc) { ${SERMON_FIELDS} }`
  );
}

/** Fetch the N most recent sermons (default 3). */
export async function getRecentSermons(limit = 3): Promise<Sermon[]> {
  return sanityClient.fetch(
    `*[_type == "sermon"] | order(date desc) [0...$limit] { ${SERMON_FIELDS} }`,
    { limit: limit - 1 }
  );
}

/** Fetch a single sermon by its Sanity document ID. */
export async function getSermonById(id: string): Promise<Sermon | null> {
  return sanityClient.fetch(
    `*[_type == "sermon" && _id == $id][0] { ${SERMON_FIELDS} }`,
    { id }
  );
}

/** Fetch sermons filtered by topic. */
export async function getSermonsByTopic(topic: string): Promise<Sermon[]> {
  return sanityClient.fetch(
    `*[_type == "sermon" && topic == $topic] | order(date desc) { ${SERMON_FIELDS} }`,
    { topic }
  );
}

/** Fetch sermons belonging to a specific series. */
export async function getSermonsBySeries(series: string): Promise<Sermon[]> {
  return sanityClient.fetch(
    `*[_type == "sermon" && series == $series] | order(seriesPart asc) { ${SERMON_FIELDS} }`,
    { series }
  );
}

/** Fetch all unique topic strings (for filter dropdowns). */
export async function getSermonTopics(): Promise<string[]> {
  const results: Array<{ topic: string }> = await sanityClient.fetch(
    `*[_type == "sermon" && defined(topic)] { topic }`
  );
  return [...new Set(results.map((r) => r.topic).filter(Boolean))].sort();
}

/** Fetch all unique series strings. */
export async function getSermonSeries(): Promise<string[]> {
  const results: Array<{ series: string }> = await sanityClient.fetch(
    `*[_type == "sermon" && defined(series)] { series }`
  );
  return [...new Set(results.map((r) => r.series).filter(Boolean))].sort();
}

// ── Songs ─────────────────────────────────────────────────────────────────────

/** Fetch all worship songs, alphabetical. */
export async function getSongs(): Promise<Song[]> {
  return sanityClient.fetch(
    `*[_type == "song"] | order(title asc) { ${SONG_FIELDS} }`
  );
}

/** Fetch a limited number of songs (for home page preview). */
export async function getRecentSongs(limit = 5): Promise<Song[]> {
  return sanityClient.fetch(
    `*[_type == "song"] | order(_createdAt desc) [0...$limit] { ${SONG_FIELDS} }`,
    { limit: limit - 1 }
  );
}

// ── Events ────────────────────────────────────────────────────────────────────

/** Fetch all public upcoming events. */
export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  const today = new Date().toISOString().split("T")[0];
  const query = limit
    ? `*[_type == "event" && isPublic != false && eventDate >= $today] | order(eventDate asc) [0...$limit] { ${EVENT_FIELDS} }`
    : `*[_type == "event" && isPublic != false && eventDate >= $today] | order(eventDate asc) { ${EVENT_FIELDS} }`;
  return sanityClient.fetch(query, { today, limit: limit ? limit - 1 : undefined });
}

/** Fetch all events including past ones. */
export async function getAllEvents(): Promise<Event[]> {
  return sanityClient.fetch(
    `*[_type == "event" && isPublic != false] | order(eventDate asc) { ${EVENT_FIELDS} }`
  );
}

/** Fetch a single event by ID. */
export async function getEventById(id: string): Promise<Event | null> {
  return sanityClient.fetch(
    `*[_type == "event" && _id == $id][0] { ${EVENT_FIELDS} }`,
    { id }
  );
}

// ── Service Schedule ──────────────────────────────────────────────────────────

/** Fetch all services in sort order. */
export async function getServiceSchedule(): Promise<ServiceSchedule[]> {
  return sanityClient.fetch(
    `*[_type == "serviceSchedule"] | order(sortOrder asc) {
      _id, serviceName, dayOfWeek, serviceTime, location, description, isOnline, sortOrder
    }`
  );
}

// ── Leadership Team ───────────────────────────────────────────────────────────

/** Fetch all leadership team members in sort order. */
export async function getLeadershipTeam(): Promise<LeadershipTeam[]> {
  return sanityClient.fetch(
    `*[_type == "leadershipTeam"] | order(sortOrder asc) {
      _id, name, role, profilePhoto, biography, email, socialMediaLink
    }`
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────

/** Fetch all gallery images, newest first. */
export async function getGallery(limit?: number): Promise<GalleryItem[]> {
  const query = limit
    ? `*[_type == "gallery"] | order(_createdAt desc) [0...$limit] { _id, title, image, category, caption, dateTaken }`
    : `*[_type == "gallery"] | order(_createdAt desc) { _id, title, image, category, caption, dateTaken }`;
  return sanityClient.fetch(query, { limit: limit ? limit - 1 : undefined });
}

// ── Daily Verse ───────────────────────────────────────────────────────────────

/** Fetch today's verse from Sanity. Returns null if none is set for today. */
export async function getTodayVerse(): Promise<DailyVerse | null> {
  const today = new Date().toISOString().split("T")[0];
  return sanityClient.fetch(
    `*[_type == "dailyVerse" && date == $today][0] {
      _id, date, verseText, verseReference, verseImage, language
    }`,
    { today }
  );
}
