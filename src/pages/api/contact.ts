/**
 * src/pages/api/contact.ts
 * Handles POST /api/contact from the ContactForm island.
 * Validates input and writes the document to Sanity via the write client.
 */
export const prerender = false;

import type { APIRoute } from "astro";
import { sanityWriteClient } from "@/lib/sanity";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(1).max(20),
  location: z.string().min(1).max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(5).max(5000),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await sanityWriteClient.create({
      _type: "contactMessage",
      name: data.name,
      email: data.email ?? "",
      phone: data.phone,
      location: data.location,
      subject: data.subject ?? "",
      message: data.message,
      dateSubmitted: new Date().toISOString(),
      isRead: false,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[/api/contact] Error:", err);
    const isValidation = err instanceof z.ZodError;
    return new Response(
      JSON.stringify({
        success: false,
        error: isValidation ? "Invalid form data" : "Server error",
      }),
      {
        status: isValidation ? 400 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// Reject non-POST methods
export const GET: APIRoute = () =>
  new Response("Method Not Allowed", { status: 405 });
