import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-primary/5 dark:bg-white/5 p-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h2 className="font-heading text-3xl text-primary dark:text-blue-300 mb-4">Message Sent!</h2>
        <p className="font-paragraph text-lg text-foreground/80 dark:text-white/70 mb-8">
          Thank you for reaching out. We'll get back to you as soon as possible.
        </p>
        <Button onClick={() => setStatus("idle")} className="bg-primary hover:bg-primary/90 text-white rounded-none">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-primary/10 dark:border-white/10 p-8">
      <h2 className="font-heading text-3xl text-primary dark:text-blue-300 mb-8">Send Us a Message</h2>

      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="font-paragraph text-sm text-red-700 dark:text-red-400">
            Something went wrong. Please try again or email us directly.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {(["name", "email", "subject"] as const).map((field) => (
          <div key={field}>
            <label htmlFor={field} className="font-paragraph text-sm text-foreground/80 dark:text-white/70 mb-2 block capitalize">
              {field === "email" ? "Email Address" : field.charAt(0).toUpperCase() + field.slice(1)}{" "}
              <span className="text-secondary">*</span>
            </label>
            <Input
              id={field}
              type={field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
              className="w-full dark:bg-slate-700 dark:border-white/20 dark:text-white"
              placeholder={
                field === "name" ? "Your full name" :
                field === "email" ? "your@email.com" :
                "What is this about?"
              }
            />
          </div>
        ))}
        <div>
          <label htmlFor="message" className="font-paragraph text-sm text-foreground/80 dark:text-white/70 mb-2 block">
            Message <span className="text-secondary">*</span>
          </label>
          <Textarea
            id="message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={6}
            className="w-full dark:bg-slate-700 dark:border-white/20 dark:text-white"
            placeholder="Your message…"
          />
        </div>
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-none"
        >
          {status === "submitting" ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Message
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
