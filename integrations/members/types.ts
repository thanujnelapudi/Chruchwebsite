/**
 * integrations/members/types.ts
 * Wix member auth has been removed. These stubs keep any future imports from
 * breaking while auth is not needed.
 */

export interface Member {
  _id: string;
  loginEmail?: string;
  profile?: {
    nickname?: string;
    photo?: { url?: string };
  };
}
