import { defineField, defineType } from "sanity";

export const sermon = defineType({
  name: "sermon",
  title: "Sermon",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Sermon Title",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(120),
    }),
    defineField({
      name: "speaker",
      title: "Speaker",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Senior Pastor", value: "Senior Pastor" },
          { title: "Guest Speaker", value: "Guest Speaker" },
        ],
      },
    }),
    defineField({
      name: "date",
      title: "Sermon Date",
      type: "date",
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: "MMMM D, YYYY",
      },
    }),
    defineField({
      name: "topic",
      title: "Topic",
      type: "string",
      description: "Main theme or topic of this message",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
        list: [
          "Faith",
          "Prayer",
          "Worship",
          "Grace",
          "Salvation",
          "Holy Spirit",
          "Bible Study",
          "Family",
          "Youth",
          "Prophecy",
          "Healing",
          "Communion",
        ],
      },
      description: "Add tags to help people find related sermons",
    }),
    defineField({
      name: "series",
      title: "Sermon Series",
      type: "string",
      description: "Name of the series this sermon belongs to (optional)",
    }),
    defineField({
      name: "seriesPart",
      title: "Part Number",
      type: "number",
      description: "Which part of the series is this? (e.g. 1, 2, 3)",
      hidden: ({ document }) => !document?.series,
    }),
    defineField({
      name: "youtubeVideoId",
      title: "YouTube Video ID",
      type: "string",
      description:
        "The ID from the YouTube URL. For https://youtube.com/watch?v=dQw4w9WgXcQ, enter: dQw4w9WgXcQ",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return true;
          return "YouTube Video IDs are exactly 11 characters (letters, numbers, _ and -)";
        }),
    }),
    defineField({
      name: "pdfUrl",
      title: "Sermon Notes PDF (Cloudflare R2 URL)",
      type: "url",
      description:
        "Paste the public URL from Cloudflare R2 after uploading the PDF",
      validation: (Rule) =>
        Rule.uri({ allowRelative: false, scheme: ["https"] }),
    }),
    defineField({
      name: "thumbnailImage",
      title: "Thumbnail Image",
      type: "image",
      description: "Cover image shown in sermon listings",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Brief description of the sermon (shown in listings)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      speaker: "speaker",
      date: "date",
      media: "thumbnailImage",
    },
    prepare({ title, speaker, date, media }) {
      return {
        title,
        subtitle: `${speaker ?? "Unknown Speaker"} · ${date ?? "No date"}`,
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
    {
      title: "Date (Oldest first)",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
});
