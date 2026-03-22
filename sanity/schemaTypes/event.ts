import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventDate",
      title: "Date",
      type: "date",
      options: { dateFormat: "MMMM D, YYYY" },
    }),
    defineField({
      name: "eventTime",
      title: "Time",
      type: "string",
      description: "e.g. 10:00 AM or 6:00 PM – 8:00 PM",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      initialValue: "The Pillar of Fire Ministries",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "eventImage",
      title: "Event Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "isPublic",
      title: "Show on website",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "eventDate",
      media: "eventImage",
    },
    prepare({ title, date, media }) {
      return {
        title,
        subtitle: date ?? "Date TBA",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Date (Soonest first)",
      name: "dateAsc",
      by: [{ field: "eventDate", direction: "asc" }],
    },
  ],
});
