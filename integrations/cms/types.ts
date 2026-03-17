/**
 * integrations/cms/types.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop-in replacement for the old @wix/data types.
 * Components that import from "@/integrations" continue working unchanged.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Base item shape — all CMS documents have at least _id. */
export interface WixDataItem {
  _id: string;
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
  [key: string]: unknown;
}

export type WixDataQueryResult = {
  items: WixDataItem[];
  totalCount: number;
};
