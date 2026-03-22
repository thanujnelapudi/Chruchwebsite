import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", subject: "", message: "" });
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
      setForm({ name: "", email: "", phone: "", location: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
    <div className="bg-white/65 backdrop-blur-[20px] border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70 pointer-events-none" />
      <h2 className="font-heading text-3xl text-primary mb-8 relative z-10">Message Sent!</h2>
      <p className="font-paragraph text-lg text-foreground/80 mb-8">
        Thank you for reaching out. We'll get back to you as soon as possible.
        </p>
        <Button onClick={() => setStatus("idle")} className="bg-primary hover:bg-primary/90 text-white rounded-none">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/65 backdrop-blur-[20px] border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70 pointer-events-none" />
      <h2 className="font-heading text-3xl text-primary mb-8 relative z-10">Send Us a Message</h2>

      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="font-paragraph text-sm text-red-700">
            Something went wrong. Please try again or email us directly.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="font-paragraph text-sm text-foreground/80 mb-2 block tracking-widest uppercase">
              Your Name <span className="text-secondary">*</span>
            </label>
            <Input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-white/90 backdrop-blur-none border border-white/30 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all shadow-inner text-foreground relative z-10"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="phone" className="font-paragraph text-sm text-foreground/80 mb-2 block tracking-widest uppercase">
              Phone Number <span className="text-secondary">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full bg-white/90 backdrop-blur-none border border-white/30 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all shadow-inner text-foreground relative z-10"
              placeholder="Your phone number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="font-paragraph text-sm text-foreground/80 mb-2 block tracking-widest uppercase">
              Your Email <span className="opacity-40 lowercase tracking-normal">(optional)</span>
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/90 backdrop-blur-none border border-white/30 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all shadow-inner text-foreground relative z-10"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="location" className="font-paragraph text-sm text-foreground/80 mb-2 block tracking-widest uppercase">
              Location <span className="text-secondary">*</span>
            </label>
            <Input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              className="w-full bg-white/90 backdrop-blur-none border border-white/30 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all shadow-inner text-foreground relative z-10"
              placeholder="City, State, or Country"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="font-paragraph text-sm text-foreground/80 mb-2 block tracking-widest uppercase">
            Subject <span className="opacity-40 lowercase tracking-normal">(optional)</span>
          </label>
          <Input
            id="subject"
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full bg-white/90 backdrop-blur-none border border-white/30 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all shadow-inner text-foreground relative z-10"
            placeholder="What is this about?"
          />
        </div>

        <div>
          <label htmlFor="message" className="font-paragraph text-sm text-foreground/80 mb-2 block">
            Message <span className="text-secondary">*</span>
          </label>
          <Textarea
            id="message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={6}
            className="w-full bg-white/90 backdrop-blur-none border border-white/30 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all shadow-inner text-foreground relative z-10"
            placeholder="Your message…"
          />
        </div>
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-primary/95 hover:bg-primary text-white py-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative z-10"
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
