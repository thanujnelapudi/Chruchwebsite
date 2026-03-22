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
    submitterPhone: "",
    submitterPlace: "",
    prayerRequestText: "",
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
      <div className="relative z-10 bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] backdrop-saturate-[1.2] border border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.3),_0_0_40px_rgba(192,168,125,0.05),_inset_0_1px_rgba(255,255,255,0.15)] rounded-[20px] p-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-[20px] border-[0.5px] border-white/[0.15] border-t-white/[0.25] border-l-white/[0.25] pointer-events-none" />
        <Heart className="w-16 h-16 text-[#C0A87D] mx-auto mb-6 relative z-10" fill="currentColor" />
        <h2 className="font-heading text-3xl text-white mb-4 relative z-10">Request Received</h2>
        <p className="font-paragraph text-lg text-white/90 mb-8 relative z-10 leading-relaxed">
          We will be praying for you. You are not alone — our church family stands with you.
        </p>
        <Button onClick={() => setStatus("idle")} className="w-full bg-[#C0A87D] hover:bg-white text-[#0A1428] rounded-full h-14 font-semibold tracking-wide transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] shadow-[0_4px_15px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(192,168,125,0.4)] relative z-10 border border-white/20">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-2xl p-8 lg:p-10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent pointer-events-none" />
      
      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 p-4 mb-6 rounded-xl relative z-10">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="font-paragraph text-sm text-red-200">
            Something went wrong. Please try again.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <p className="font-paragraph text-sm text-[#C0A87D] italic text-center mb-6">
          Rest assured, your details are safe with us.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
              Your Name <span className="text-[#C0A87D]">*</span>
            </label>
            <Input
              id="name"
              required
              value={form.submitterName}
              onChange={(e) => setForm({ ...form, submitterName: e.target.value })}
              className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="phone" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
              Phone Number <span className="text-[#C0A87D]">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              required
              value={form.submitterPhone}
              onChange={(e) => setForm({ ...form, submitterPhone: e.target.value })}
              className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]"
              placeholder="Your phone number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
              Email Address <span className="opacity-40 lowercase tracking-normal">(optional)</span>
            </label>
            <Input
              id="email"
              type="email"
              value={form.submitterEmail}
              onChange={(e) => setForm({ ...form, submitterEmail: e.target.value })}
              className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="place" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
              Your Place <span className="text-[#C0A87D]">*</span>
            </label>
            <Input
              id="place"
              required
              value={form.submitterPlace}
              onChange={(e) => setForm({ ...form, submitterPlace: e.target.value })}
              className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 h-14 px-5 font-light focus:bg-white/[0.12]"
              placeholder="City, State, or Country"
            />
          </div>
        </div>

        <div>
          <label htmlFor="prayer" className="font-paragraph text-[13px] md:text-sm text-[#FDFBF7]/80 mb-2 block tracking-widest uppercase">
            Your Prayer Request <span className="text-[#C0A87D]">*</span>
          </label>
          <Textarea
            id="prayer"
            value={form.prayerRequestText}
            onChange={(e) => setForm({ ...form, prayerRequestText: e.target.value })}
            required
            rows={7}
            className="w-full bg-white/[0.08] backdrop-blur-[10px] border border-white/[0.15] rounded-xl focus:border-[#C0A87D] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] text-white placeholder:text-white/50 relative z-10 p-5 font-light resize-none focus:bg-white/[0.12]"
            placeholder="Share what's on your heart. This will only be seen by our pastoral team."
          />
        </div>

        <div className="pt-2 lg:pt-4">
          <Button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-[#C0A87D] hover:bg-white text-[#0A1428] font-medium tracking-widest uppercase py-7 md:py-8 rounded-[9999px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(192,168,125,0.4)] transition-all duration-300 relative z-10"
          >
            {status === "submitting" ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-[3px] border-[#0A1428]/30 border-t-[#0A1428] rounded-full animate-spin" />
                Submitting…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <Heart className="w-5 h-5 opacity-90" />
                Submit Prayer Request
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
