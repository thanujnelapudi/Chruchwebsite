/**
 * src/entities/index.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Entity interfaces used by page components.
 * These match both the old Wix field names (for existing components) and
 * the normalised output of BaseCrudService.
 *
 * Phase 2 will migrate to the typed interfaces in src/lib/sanity.ts.
 * For now we keep these to avoid any component breakage during Phase 1.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface ContactMessages {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  dateSubmitted?: Date | string;
}

export interface Events {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  title?: string;
  eventDate?: Date | string;
  eventTime?: string;
  description?: string;
  /** Image URL (string after normalisation by BaseCrudService) */
  eventImage?: string;
}

export interface ChurchGallery {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  title?: string;
  /** Image URL (string after normalisation by BaseCrudService) */
  image?: string;
  category?: string;
  caption?: string;
  dateTaken?: Date | string;
}

export interface LeadershipTeam {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  name?: string;
  role?: string;
  biography?: string;
  /** Image URL (string after normalisation by BaseCrudService) */
  profilePhoto?: string;
  email?: string;
  socialMediaLink?: string;
}

export interface PrayerRequests {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  submitterName?: string;
  submitterEmail?: string;
  prayerRequestText?: string;
  isAnonymous?: boolean;
  dateSubmitted?: Date | string;
}

/**
 * Resources entity — now backed by the Sermon schema.
 * Components that import Resources still receive this shape
 * because BaseCrudService normalises sermon documents into it.
 */
export interface Resources {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  resourceTitle?: string;
  fileUrl?: string;          // = pdfUrl from Sanity
  resourceType?: string;     // always "Sermon Notes"
  description?: string;
  datePublished?: Date | string;  // = date from Sanity
  // Bonus sermon fields passed through
  speaker?: string;
  youtubeVideoId?: string;
  topic?: string;
  tags?: string[];
  series?: string;
}

export interface ServiceSchedule {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  serviceName?: string;
  dayOfWeek?: string;
  serviceTime?: string;
  description?: string;
  location?: string;
  isOnline?: boolean;
}

export interface WorshipSongs {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  /** Mapped from Sanity "title" field by BaseCrudService.normaliseItem */
  songTitle?: string;
  lyrics?: string;
  audioLink?: string;
  artist?: string;
  genre?: string;
  titleTelugu?: string;
  tags?: string[];
}
