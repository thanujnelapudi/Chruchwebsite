import { defineField, defineType } from "sanity";

export const prayerRequest = defineType({
  name: "prayerRequest",
  title: "Prayer Request",
  type: "document",
  fields: [
    defineField({
      name: "submitterName",
      title: "Name",
      type: "string",
      description: "Hidden if submitted anonymously",
    }),
    defineField({
      name: "submitterEmail",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "prayerRequestText",
      title: "Prayer Request",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isAnonymous",
      title: "Submitted Anonymously",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "dateSubmitted",
      title: "Submitted On",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "isPrayed",
      title: "Marked as Prayed",
      type: "boolean",
      initialValue: false,
      description: "Check this once the leadership team has prayed for this request",
    }),
  ],
  preview: {
    select: {
      name: "submitterName",
      text: "prayerRequestText",
      anon: "isAnonymous",
      date: "dateSubmitted",
    },
    prepare({ name, text, anon, date }) {
      return {
        title: anon ? "Anonymous" : (name ?? "Unknown"),
        subtitle: `${date ? new Date(date).toLocaleDateString() : ""} · ${text?.slice(0, 60) ?? ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Date (Newest first)",
      name: "dateDesc",
      by: [{ field: "dateSubmitted", direction: "desc" }],
    },
  ],
});
