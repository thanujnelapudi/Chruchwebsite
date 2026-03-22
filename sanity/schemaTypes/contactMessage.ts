import { defineField, defineType } from "sanity";

export const contactMessage = defineType({
  name: "contactMessage",
  title: "Contact Message",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message",
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
      name: "isRead",
      title: "Marked as Read",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      name: "name",
      subject: "subject",
      date: "dateSubmitted",
    },
    prepare({ name, subject, date }) {
      return {
        title: name,
        subtitle: `${date ? new Date(date).toLocaleDateString() : ""} · ${subject ?? ""}`,
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
