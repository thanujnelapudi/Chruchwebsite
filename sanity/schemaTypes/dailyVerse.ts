import { defineField, defineType } from "sanity";

export const dailyVerse = defineType({
  name: "dailyVerse",
  title: "Daily Verse",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
      options: { dateFormat: "MMMM D, YYYY" },
      description: "The date this verse appears on the home page",
    }),
    defineField({
      name: "verseText",
      title: "Verse Text",
      type: "text",
      rows: 3,
      description: "The scripture text (supports Telugu Unicode)",
    }),
    defineField({
      name: "verseReference",
      title: "Verse Reference",
      type: "string",
      description: 'e.g. "John 3:16" or "యోహాను 3:16"',
    }),
    defineField({
      name: "verseImage",
      title: "Verse Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional: upload a pre-designed verse image card. If provided, this image is shown instead of the text.",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Telugu", value: "te" },
          { title: "Both", value: "both" },
        ],
      },
      initialValue: "en",
    }),
  ],
  preview: {
    select: {
      date: "date",
      reference: "verseReference",
      media: "verseImage",
    },
    prepare({ date, reference, media }) {
      return {
        title: reference ?? "Verse",
        subtitle: date ?? "",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Date (Newest first)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
