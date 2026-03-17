import { defineField, defineType } from "sanity";

export const song = defineType({
  name: "song",
  title: "Worship Song",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Song Title",
      type: "string",
      description: "Title in English or transliteration (used for search and display)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleTelugu",
      title: "Song Title (Telugu)",
      type: "string",
      description: "Original title in Telugu script (e.g. నా స్తుతి పాత్రుడా)",
    }),
    defineField({
      name: "lyrics",
      title: "Lyrics",
      type: "text",
      rows: 20,
      description:
        "Full lyrics. Supports Telugu Unicode (e.g. నా స్తుతి పాత్రుడా). " +
        "Use blank lines to separate verses. Label sections like 'Verse 1', 'Chorus' etc.",
    }),
    defineField({
      name: "artist",
      title: "Artist / Composer",
      type: "string",
    }),
    defineField({
      name: "genre",
      title: "Genre",
      type: "string",
      options: {
        list: [
          { title: "Telugu Worship", value: "Telugu Worship" },
          { title: "English Worship", value: "English Worship" },
          { title: "Hindi Worship", value: "Hindi Worship" },
          { title: "Traditional Hymn", value: "Traditional Hymn" },
          { title: "Contemporary", value: "Contemporary" },
          { title: "Praise & Worship", value: "Praise & Worship" },
        ],
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
        list: [
          "Worship",
          "Praise",
          "Prayer",
          "Communion",
          "Christmas",
          "Easter",
          "Youth",
          "Telugu",
          "English",
        ],
      },
    }),
    defineField({
      name: "audioLink",
      title: "Audio Link (YouTube / SoundCloud)",
      type: "url",
      description: "Optional link to an audio or video recording of this song",
    }),
  ],
  preview: {
    select: {
      title: "title",
      artist: "artist",
      genre: "genre",
    },
    prepare({ title, artist, genre }) {
      return {
        title,
        subtitle: [artist, genre].filter(Boolean).join(" · ") || "Worship Song",
      };
    },
  },
  orderings: [
    {
      title: "Title A–Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
