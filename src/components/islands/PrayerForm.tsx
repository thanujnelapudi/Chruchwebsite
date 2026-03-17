import { useState } from "react";
import { Heart, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "submitting" | "success" | "error";

export default function PrayerForm() {
  const [form, setForm] = useState({
    submitterName: "",
    submitterEmail: "",
    prayerRequestText: "",
    isAnonymous: false,
  });
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-primary/5 dark:bg-white/5 p-12 text-center">
        <Heart className="w-16 h-16 text-secondary mx-auto mb-6" fill="currentColor" />
        <h2 className="font-heading text-3xl text-primary dark:text-blue-300 mb-4">Request Received</h2>
        <p className="font-paragraph text-lg text-foreground/80 dark:text-white/70 mb-8">
          We will be praying for you. You are not alone — our church family stands with you.
        </p>
        <Button onClick={() => setStatus("idle")} className="bg-primary hover:bg-primary/90 text-white rounded-none">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-primary/10 dark:border-white/10 p-8">
      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="font-paragraph text-sm text-red-700 dark:text-red-400">
            Something went wrong. Please try again.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 p-4 bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-white/10 mb-6">
          <input
            type="checkbox"
            id="anonymous"
            checked={form.isAnonymous}
            onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="anonymous" className="font-paragraph text-sm text-foreground/80 dark:text-white/70 cursor-pointer">
            Submit anonymously — your name won't be shared
          </label>
        </div>

        {!form.isAnonymous && (
          <>
            <div>
              <label htmlFor="name" className="font-paragraph text-sm text-foreground/80 dark:text-white/70 mb-2 block">
                Your Name
              </label>
              <Input
                id="name"
                value={form.submitterName}
                onChange={(e) => setForm({ ...form, submitterName: e.target.value })}
                className="w-full dark:bg-slate-700 dark:border-white/20 dark:text-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-paragraph text-sm text-foreground/80 dark:text-white/70 mb-2 block">
                Email Address <span className="text-foreground/40 dark:text-white/30 font-normal">(optional — we may follow up)</span>
              </label>
              <Input
                id="email"
                type="email"
                value={form.submitterEmail}
                onChange={(e) => setForm({ ...form, submitterEmail: e.target.value })}
                className="w-full dark:bg-slate-700 dark:border-white/20 dark:text-white"
                placeholder="your@email.com"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="prayer" className="font-paragraph text-sm text-foreground/80 dark:text-white/70 mb-2 block">
            Your Prayer Request <span className="text-secondary">*</span>
          </label>
          <Textarea
            id="prayer"
            value={form.prayerRequestText}
            onChange={(e) => setForm({ ...form, prayerRequestText: e.target.value })}
            required
            rows={7}
            className="w-full dark:bg-slate-700 dark:border-white/20 dark:text-white"
            placeholder="Share what's on your heart. This will only be seen by our pastoral team."
          />
        </div>

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-secondary hover:bg-secondary/90 text-white py-6 rounded-none"
        >
          {status === "submitting" ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Submit Prayer Request
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
