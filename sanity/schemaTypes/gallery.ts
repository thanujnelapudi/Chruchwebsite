import { defineField, defineType } from "sanity";

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Worship Service", value: "Worship Service" },
          { title: "Special Event", value: "Special Event" },
          { title: "Youth", value: "Youth" },
          { title: "Community", value: "Community" },
          { title: "Leadership", value: "Leadership" },
          { title: "Other", value: "Other" },
        ],
      },
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "dateTaken",
      title: "Date",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
    }),
  ],
  preview: {
    select: {
      title: "title",
      caption: "caption",
      category: "category",
      media: "image",
    },
    prepare({ title, caption, category, media }) {
      return {
        title: title || caption || "Gallery Image",
        subtitle: category ?? "",
        media,
      };
    },
  },
});
