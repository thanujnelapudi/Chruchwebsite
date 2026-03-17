/**
 * integrations/cms/service.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop-in replacement for the Wix BaseCrudService.
 *
 * All existing page components call:
 *   BaseCrudService.getAll<T>('collectionName')
 *   BaseCrudService.getById<T>('collectionName', id)
 *   BaseCrudService.create('collectionName', data)
 *
 * Those calls are preserved exactly — no component changes needed in Phase 1.
 *
 * Under the hood, calls are routed to Sanity GROQ queries via the sanityClient.
 * The collection name mapping table below translates old Wix collection IDs
 * to their Sanity _type equivalents.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { sanityClient, sanityWriteClient } from "../../src/lib/sanity";
import type { WixDataItem } from "./types";

// ── Collection name mapping ───────────────────────────────────────────────────
// Keys = Wix collection IDs used in existing component calls
// Values = Sanity _type names defined in schemas

const COLLECTION_MAP: Record<string, string> = {
  worshipsongs: "song",
  serviceschedule: "serviceSchedule",
  events: "event",
  gallery: "gallery",
  leadershipteam: "leadershipTeam",
  prayerrequests: "prayerRequest",
  contactmessages: "contactMessage",
  resources: "sermon",        // Resources page → replaced by Sermons
  sermons: "sermon",
};

function sanityType(collectionId: string): string {
  const mapped = COLLECTION_MAP[collectionId.toLowerCase()];
  if (!mapped) {
    console.warn(`[BaseCrudService] Unknown collection "${collectionId}" — using as-is.`);
    return collectionId;
  }
  return mapped;
}

// ── Field shape normalisation ─────────────────────────────────────────────────
// Sanity returns camelCase fields; old Wix entity names differ for some fields.
// This function translates Sanity documents back to the shape components expect.

function normaliseItem<T>(item: Record<string, unknown>, collectionId: string): T {
  const type = sanityType(collectionId);

  // Common: ensure _id is always a string
  const base: Record<string, unknown> = { ...item, _id: String(item._id ?? item._id) };

  switch (type) {
    case "song": {
      // Components expect: songTitle, artist, genre, lyrics, audioLink
      return {
        ...base,
        songTitle: item.title,
        // rest of the fields already match
      } as T;
    }
    case "serviceSchedule": {
      // Components expect: serviceName, dayOfWeek, serviceTime, description, location, isOnline
      return {
        ...base,
        // Sanity field names already match serviceSchedule entity
      } as T;
    }
    case "sermon": {
      // Components expect Resources shape: resourceTitle, fileUrl, resourceType, description, datePublished
      return {
        ...base,
        resourceTitle: item.title,
        fileUrl: item.pdfUrl,
        resourceType: "Sermon Notes",
        datePublished: item.date,
        // pass-through all sermon fields too for any direct sermon usage
      } as T;
    }
    case "event": {
      // Components expect: title, eventDate, eventTime, description, eventImage
      return {
        ...base,
        eventImage: item.eventImage
          ? buildSanityImageUrl(item.eventImage as Record<string, unknown>)
          : undefined,
      } as T;
    }
    case "gallery": {
      // Components expect: title, image, category, caption, dateTaken
      return {
        ...base,
        image: item.image
          ? buildSanityImageUrl(item.image as Record<string, unknown>)
          : undefined,
      } as T;
    }
    case "leadershipTeam": {
      return {
        ...base,
        profilePhoto: item.profilePhoto
          ? buildSanityImageUrl(item.profilePhoto as Record<string, unknown>)
          : undefined,
      } as T;
    }
    default:
      return base as T;
  }
}

/**
 * Convert a Sanity image reference to a usable HTTPS URL.
 * Extracts the asset ID from the Sanity reference format and constructs
 * the CDN URL. Components can pass this directly to <img src=...>.
 */
function buildSanityImageUrl(
  imageRef: Record<string, unknown>,
  width = 800
): string | undefined {
  try {
    const projectId =
      (typeof window !== "undefined"
        ? undefined
        : process.env.SANITY_PROJECT_ID) ?? "";
    const dataset =
      (typeof window !== "undefined"
        ? undefined
        : process.env.SANITY_DATASET) ?? "production";

    const ref = (imageRef?.asset as Record<string, unknown>)?._ref as string;
    if (!ref) return undefined;

    // ref format: "image-{assetId}-{dimensions}-{format}"
    const [, assetId, dimensions, format] = ref.split("-");
    if (!assetId) return undefined;

    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${format}?w=${width}&auto=format&fit=max`;
  } catch {
    return undefined;
  }
}

// ── Pagination result ─────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  nextSkip: number | null;
}

export interface PaginationOptions {
  limit?: number;
  skip?: number;
}

// ── BaseCrudService ───────────────────────────────────────────────────────────

export class BaseCrudService {
  /**
   * Fetch all items from a collection.
   * Drop-in replacement for the Wix version — same signature.
   */
  static async getAll<T extends WixDataItem>(
    collectionId: string,
    _includeRefs?: unknown,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const type = sanityType(collectionId);
    const limit = Math.min(pagination?.limit ?? 100, 1000);
    const skip = pagination?.skip ?? 0;

    const orderField = type === "sermon" ? "date desc" :
                       type === "event"  ? "eventDate asc" :
                       type === "serviceSchedule" ? "sortOrder asc" :
                       "_createdAt desc";

    try {
      const items: Record<string, unknown>[] = await sanityClient.fetch(
        `*[_type == $type] | order(${orderField}) [$skip...$end] {
          ...,
          "imageUrl": image.asset._ref,
          "eventImageUrl": eventImage.asset._ref
        }`,
        { type, skip, end: skip + limit - 1 }
      );

      const totalCount: number = await sanityClient.fetch(
        `count(*[_type == $type])`,
        { type }
      );

      const hasNext = skip + limit < totalCount;

      return {
        items: items.map((item) => normaliseItem<T>(item, collectionId)),
        totalCount,
        hasNext,
        currentPage: Math.floor(skip / limit),
        pageSize: limit,
        nextSkip: hasNext ? skip + limit : null,
      };
    } catch (error) {
      console.error(`[BaseCrudService] getAll("${collectionId}") failed:`, error);
      return {
        items: [],
        totalCount: 0,
        hasNext: false,
        currentPage: 0,
        pageSize: limit,
        nextSkip: null,
      };
    }
  }

  /**
   * Fetch a single item by Sanity document ID.
   * Drop-in replacement for the Wix version — same signature.
   */
  static async getById<T extends WixDataItem>(
    collectionId: string,
    itemId: string,
    _includeRefs?: unknown
  ): Promise<T | null> {
    const type = sanityType(collectionId);
    try {
      const item: Record<string, unknown> | null = await sanityClient.fetch(
        `*[_type == $type && _id == $id][0] { ... }`,
        { type, id: itemId }
      );
      if (!item) return null;
      return normaliseItem<T>(item, collectionId);
    } catch (error) {
      console.error(`[BaseCrudService] getById("${collectionId}", "${itemId}") failed:`, error);
      return null;
    }
  }

  /**
   * Create a new document in Sanity.
   * Used by ContactPage and PrayerRequestsPage form submissions.
   */
  static async create<T extends WixDataItem>(
    collectionId: string,
    itemData: Partial<T> | Record<string, unknown>,
    _multiReferences?: unknown
  ): Promise<T> {
    const type = sanityType(collectionId);
    try {
      const doc = {
        _type: type,
        ...itemData,
        dateSubmitted: new Date().toISOString(),
      };
      // Remove _id if present — Sanity will generate one
      delete (doc as Record<string, unknown>)._id;

      const result = await sanityWriteClient.create(doc);
      return normaliseItem<T>(result as Record<string, unknown>, collectionId);
    } catch (error) {
      console.error(`[BaseCrudService] create("${collectionId}") failed:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Failed to create ${collectionId}`
      );
    }
  }

  /**
   * Update an existing document.
   */
  static async update<T extends WixDataItem>(
    collectionId: string,
    itemData: T
  ): Promise<T> {
    if (!itemData._id) throw new Error(`_id is required for update`);
    try {
      const { _id, ...rest } = itemData;
      const result = await sanityWriteClient
        .patch(String(_id))
        .set(rest as Record<string, unknown>)
        .commit();
      return normaliseItem<T>(result as Record<string, unknown>, collectionId);
    } catch (error) {
      console.error(`[BaseCrudService] update("${collectionId}") failed:`, error);
      throw error;
    }
  }

  /**
   * Delete a document by ID.
   */
  static async delete<T extends WixDataItem>(
    collectionId: string,
    itemId: string
  ): Promise<T> {
    try {
      const result = await sanityWriteClient.delete(itemId);
      return result as unknown as T;
    } catch (error) {
      console.error(`[BaseCrudService] delete("${collectionId}", "${itemId}") failed:`, error);
      throw error;
    }
  }

  // Stub methods — kept so any future code that calls these doesn't break
  static async addReferences(): Promise<void> { /* no-op */ }
  static async removeReferences(): Promise<void> { /* no-op */ }
}
