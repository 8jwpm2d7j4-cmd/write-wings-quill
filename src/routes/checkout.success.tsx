import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Heart, Unlock, Crown, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/checkout/success")({
  component: SuccessPage,
  validateSearch: (s: Record<string, unknown>) => ({ kind: (s.kind as string) ?? "pro" }),
});

function SuccessPage() {
  const { kind } = Route.useSearch();
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 50); return () => clearTimeout(t); }, []);

  const meta = kind === "tip"
    ? { icon: Heart, title: "Thanks for tipping!", body: "Your support means the world to this writer.", cta: "Keep reading", to: "/discover" as const }
    : kind === "unlock"
    ? { icon: Unlock, title: "Chapter unlocked", body: "Refresh the chapter to keep reading where you left off.", cta: "Back to library", to: "/" as const }
    : { icon: Crown, title: "Welcome to Quill Pro", body: "Your membership is being activated. Pro features unlock in a few seconds.", cta: "Start writing", to: "/" as const };

  const Icon = meta.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-paper text-ink relative overflow-hidden">
      {/* Confetti sparkles */}
      {show && (
        <>
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-primary/70 animate-[fall_2.5s_ease-out_forwards] pointer-events-none"
              style={{
                left: `${(i * 7) % 100}%`,
                top: `-${10 + (i % 5) * 5}%`,
                animationDelay: `${(i % 7) * 0.15}s`,
                fontSize: `${10 + (i % 5) * 4}px`,
              }}
            >
              ✦
            </span>
          ))}
        </>
      )}

      <div className={`max-w-sm text-center space-y-5 transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-9 w-9" />
        </div>
        <h1 className="font-serif text-3xl">{meta.title}</h1>
        <p className="text-ink/70">{meta.body}</p>
        <Link
          to={meta.to}
          className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-full bg-ink text-paper text-sm font-medium hover:opacity-90 transition"
        >
          {meta.cta} <ArrowRight className="h-4 w-4" />
        </Link>
        <div className="pt-3 text-[11px] text-ink/50 inline-flex items-center gap-1 justify-center">
          <Sparkles className="h-3 w-3" /> Receipt sent to your email
        </div>
      </div>

      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
