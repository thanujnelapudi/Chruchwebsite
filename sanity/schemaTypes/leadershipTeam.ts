import { defineField, defineType } from "sanity";

export const leadershipTeam = defineType({
  name: "leadershipTeam",
  title: "Leadership Team",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      description: 'e.g. "Senior Pastor", "Associate Pastor", "Elder"',
    }),
    defineField({
      name: "profilePhoto",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "biography",
      title: "Biography",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
    }),
    defineField({
      name: "socialMediaLink",
      title: "Social Media Link",
      type: "url",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first on the About page.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "profilePhoto",
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
