import { defineField, defineType } from "sanity";

export const source = defineType({
    name: "source",
    title: "Source",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required().min(3).max(120),
            description: "e.g. \"Prayer for Healing – Supporting Verses\" or \"World AIDS Day Awareness Poster\"",
        }),
        defineField({
            name: "fileType",
            title: "File Type",
            type: "string",
            options: {
                list: [
                    { title: "PDF", value: "pdf" },
                    { title: "Image", value: "image" },
                    { title: "Word Document", value: "docx" },
                    { title: "Other", value: "other" },
                ],
                layout: "radio",
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "fileUrl",
            title: "File URL (Cloudflare R2)",
            type: "url",
            description: "Paste the public URL from Cloudflare R2 after uploading the file",
            validation: (Rule) =>
                Rule.required().uri({ allowRelative: false, scheme: ["https"] }),
        }),
        defineField({
            name: "relatedSermon",
            title: "Related Sermon",
            type: "reference",
            to: [{ type: "sermon" }],
            description:
                "Leave empty for standalone material (general awareness content not tied to a specific sermon). Set this to have the item also appear on that sermon's page.",
        }),
        defineField({
            name: "category",
            title: "Category",
            type: "string",
            options: {
                list: [
                    { title: "Sermon Support", value: "Sermon Support" },
                    { title: "Awareness Campaign", value: "Awareness Campaign" },
                    { title: "Community Outreach", value: "Community Outreach" },
                    { title: "Health & Wellness", value: "Health & Wellness" },
                    { title: "Social Issue", value: "Social Issue" },
                    { title: "Other", value: "Other" },
                ],
            },
            description: "Mainly used to organize standalone items on the Sources page.",
        }),
        defineField({
            name: "caption",
            title: "Caption / Description",
            type: "text",
            rows: 3,
            description: "Brief note on what this is and/or why it was shown",
        }),
        defineField({
            name: "date",
            title: "Date Displayed",
            type: "date",
            options: { dateFormat: "MMMM D, YYYY" },
        }),
    ],
    preview: {
        select: {
            title: "title",
            fileType: "fileType",
            category: "category",
            sermonTitle: "relatedSermon.title",
        },
        prepare({ title, fileType, category, sermonTitle }) {
            return {
                title,
                subtitle: sermonTitle
                    ? `${fileType?.toUpperCase() ?? ""} · Linked to: ${sermonTitle}`
                    : `${fileType?.toUpperCase() ?? ""} · ${category ?? "Standalone"}`,
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