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
      name: "category",
      title: "Sermon Category",
      type: "string",
      options: {
        list: [
          { title: "Sunday Sermons", value: "Sunday Sermons" },
          { title: "Wednesday Sermons", value: "Wednesday Sermons" },
          { title: "Youth Meeting", value: "Youth Meeting" }
        ],
        layout: "radio"
      }
    }),
    defineField({
      name: "speaker",
      title: "Speaker Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Enter the full name of the speaker",
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
      title: "YouTube Video ID or Link",
      type: "string",
      description: "Paste the YouTube Video ID (e.g. dQw4w9WgXcQ) OR the full URL.",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return true;
          if (value.includes('youtube.com') || value.includes('youtu.be')) return true;
          return "Please enter a valid YouTube Video ID or a valid YouTube URL";
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
    },
    prepare({ title, speaker, date }) {
      return {
        title,
        subtitle: `${speaker ?? "Unknown Speaker"} · ${date ?? "No date"}`,
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
