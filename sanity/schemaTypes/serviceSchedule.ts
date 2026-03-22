import { defineField, defineType } from "sanity";

export const serviceSchedule = defineType({
  name: "serviceSchedule",
  title: "Service Schedule",
  type: "document",
  fields: [
    defineField({
      name: "serviceName",
      title: "Service Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: 'e.g. "Sunday Morning Worship", "Bible Study", "Youth Meeting"',
    }),
    defineField({
      name: "dayOfWeek",
      title: "Day / Schedule",
      type: "string",
      description:
        'e.g. "Sunday", "Wednesday at 7:00 PM", "Second and last Sunday of every month at 4:30 PM"',
    }),
    defineField({
      name: "serviceTime",
      title: "Time",
      type: "string",
      description: "Display time (e.g. 10:00 AM)",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'Where the service is held (e.g., Main Sanctuary, Online)',
      initialValue: "The Pillar of Cloud Tabernacle",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "isOnline",
      title: "Available Online (YouTube)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first. Use to control display order.",
    }),
  ],
  preview: {
    select: {
      title: "serviceName",
      day: "dayOfWeek",
      online: "isOnline",
    },
    prepare({ title, day, online }) {
      return {
        title,
        subtitle: `${day ?? ""}${online ? " · Online" : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
});
