import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "ip63ijbc",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false
});

async function run() {
  const contacts = await client.fetch('*[_type == "contactMessage"]');
  console.log("Contacts count:", contacts.length);
  const prayers = await client.fetch('*[_type == "prayerRequest"]');
  console.log("Prayers count:", prayers.length);
}
run().catch(console.error);
