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
    }),
    defineField({
      name: "submitterEmail",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "submitterPhone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "submitterPlace",
      title: "Place",
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
      date: "dateSubmitted",
    },
    prepare({ name, text, date }) {
      return {
        title: name ?? "Unknown",
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
