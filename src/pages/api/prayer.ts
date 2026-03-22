/**
 * src/pages/api/prayer.ts
 * Handles POST /api/prayer from the PrayerForm island.
 */
export const prerender = false;

import type { APIRoute } from "astro";
import { sanityWriteClient } from "@/lib/sanity";
import { z } from "zod";

const schema = z.object({
  submitterName: z.string().min(1).max(120),
  submitterEmail: z.string().email().optional().or(z.literal("")),
  submitterPhone: z.string().min(5).max(30),
  submitterPlace: z.string().min(1).max(120),
  prayerRequestText: z.string().min(5).max(5000),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await sanityWriteClient.create({
      _type: "prayerRequest",
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail || undefined,
      submitterPhone: data.submitterPhone,
      submitterPlace: data.submitterPlace,
      prayerRequestText: data.prayerRequestText,
      dateSubmitted: new Date().toISOString(),
      isPrayed: false,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[/api/prayer] Error:", err);
    const isValidation = err instanceof z.ZodError;
    return new Response(
      JSON.stringify({ success: false, error: isValidation ? "Invalid data" : "Server error" }),
      {
        status: isValidation ? 400 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET: APIRoute = () =>
  new Response("Method Not Allowed", { status: 405 });
