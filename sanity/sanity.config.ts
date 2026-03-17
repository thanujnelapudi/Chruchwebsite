import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "pct-church",
  title: "PCT Church CMS",
  projectId: "ip63ijbc",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("Sermons").schemaType("sermon").child(S.documentTypeList("sermon").title("Sermons")),
            S.listItem().title("Worship Songs").schemaType("song").child(S.documentTypeList("song").title("Worship Songs")),
            S.listItem().title("Events").schemaType("event").child(S.documentTypeList("event").title("Events")),
            S.listItem().title("Service Schedule").schemaType("serviceSchedule").child(S.documentTypeList("serviceSchedule").title("Service Schedule")),
            S.divider(),
            S.listItem().title("Daily Verse").schemaType("dailyVerse").child(S.documentTypeList("dailyVerse").title("Daily Verses")),
            S.listItem().title("Gallery").schemaType("gallery").child(S.documentTypeList("gallery").title("Gallery")),
            S.listItem().title("Leadership Team").schemaType("leadershipTeam").child(S.documentTypeList("leadershipTeam").title("Leadership Team")),
            S.divider(),
            S.listItem().title("Prayer Requests").schemaType("prayerRequest").child(S.documentTypeList("prayerRequest").title("Prayer Requests")),
            S.listItem().title("Contact Messages").schemaType("contactMessage").child(S.documentTypeList("contactMessage").title("Contact Messages")),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});