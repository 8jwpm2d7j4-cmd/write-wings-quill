import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, Download, Share2, Twitter, Instagram, Facebook, Linkedin, Check } from "lucide-react";
import { toast } from "sonner";
import heroImg from "@/assets/marketing-hero.jpg";
import post1 from "@/assets/social-post-1.jpg";
import post2 from "@/assets/social-post-2.jpg";
import promoVideo from "@/assets/promo-video.mp4.asset.json";
import { SignupCounter } from "@/components/SignupCounter";

export const Route = createFileRoute("/marketing")({
  component: () => <AppShell><Marketing /></AppShell>,
  head: () => ({
    meta: [
      { title: "Share Quill — Marketing kit" },
      { name: "description", content: "Posters, captions, and a promo video to help spread the word about Quill." },
    ],
  }),
});

const SITE = typeof window !== "undefined" ? window.location.origin : "https://quill.lovable.app";

const CAPTIONS = [
  {
    title: "The Hook",
    body: "I've been writing my novel on Quill — it's the first app that actually feels like a writing studio in your pocket. AI co-writer, cover generator, and you can publish straight to Kindle. ✦ try it: " + SITE,
    hashtags: "#WritingCommunity #AmWriting #IndieAuthor #SelfPublishing #BookTok",
  },
  {
    title: "The Story",
    body: "365 days. 1 chapter at a time. Quill gives you streaks, daily goals, and an AI that actually sounds like you. Your story deserves to be told. → " + SITE,
    hashtags: "#WritersOfInstagram #WritingGoals #NovelWriting #AuthorLife",
  },
  {
    title: "The Pitch",
    body: "Stop waiting for permission to be a writer. Quill: AI co-writer, AI book covers, EPUB export, Kindle publishing — $6/mo. Your first chapter is one tap away. " + SITE,
    hashtags: "#IndieAuthor #WritingApp #BookLovers #Authors #WritingTips",
  },
  {
    title: "Reader Pitch",
    body: "Discovered the most beautiful reading app — Quill. Indie authors publishing chapters in real time, you can tip them directly, and the typography is *chef's kiss*. " + SITE + "/discover",
    hashtags: "#BookTok #Bookstagram #Reading #IndieBooks #AmReading",
  },
];

function Marketing() {
  return (
    <div className="px-5 pt-12 pb-12">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Profile
      </Link>
      <h1 className="mt-2 font-serif text-3xl">Share Quill</h1>
      <p className="mt-1 text-sm text-muted-foreground">Posters, captions, and a 5-second promo video — ready to post.</p>
      <div className="mt-3"><SignupCounter /></div>

      {/* Promo video */}
      <section className="mt-6">
        <SectionLabel>Promo video</SectionLabel>
        <div className="mt-3 paper-card overflow-hidden">
          <video
            src={(promoVideo as { url: string }).url}
            autoPlay loop muted playsInline
            className="w-full aspect-video object-cover"
          />
          <div className="p-3 flex gap-2">
            <a href={(promoVideo as { url: string }).url} download="quill-promo.mp4"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm">
              <Download className="h-4 w-4" />Download MP4
            </a>
          </div>
        </div>
      </section>

      {/* Hero poster */}
      <section className="mt-8">
        <SectionLabel>Hero poster</SectionLabel>
        <PosterCard src={heroImg} filename="quill-hero.jpg" />
      </section>

      {/* Social squares */}
      <section className="mt-8">
        <SectionLabel>Instagram squares</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <PosterCard src={post1} filename="quill-post-write.jpg" small />
          <PosterCard src={post2} filename="quill-post-kindle.jpg" small />
        </div>
      </section>

      {/* Captions */}
      <section className="mt-8">
        <SectionLabel>Ready-to-post captions</SectionLabel>
        <div className="mt-3 space-y-3">
          {CAPTIONS.map((c) => <CaptionCard key={c.title} {...c} />)}
        </div>
      </section>

      {/* Share buttons */}
      <section className="mt-8">
        <SectionLabel>One-tap share</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ShareBtn icon={Twitter} label="Twitter / X"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I'm writing my novel on Quill ✦ " + SITE)}`} />
          <ShareBtn icon={Facebook} label="Facebook"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE)}`} />
          <ShareBtn icon={Linkedin} label="LinkedIn"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE)}`} />
          <ShareBtn icon={Instagram} label="Instagram"
            onClick={() => { navigator.clipboard.writeText(CAPTIONS[0].body + "\n\n" + CAPTIONS[0].hashtags); toast.success("Caption copied — paste in Instagram"); }} />
          <button
            onClick={async () => {
              if (navigator.share) {
                try { await navigator.share({ title: "Quill", text: "Write the book in you ✦", url: SITE }); }
                catch { /* cancelled */ }
              } else {
                navigator.clipboard.writeText(SITE);
                toast.success("Link copied");
              }
            }}
            className="col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-3 text-sm font-medium"
          >
            <Share2 className="h-4 w-4" />Share via system sheet
          </button>
        </div>
      </section>

      {/* App store / discovery tips */}
      <section className="mt-10 paper-card p-5">
        <SectionLabel>Discovery checklist</SectionLabel>
        <ul className="mt-3 space-y-2 text-sm text-foreground/80">
          <Tip done>SEO meta + Open Graph + Twitter cards on every page</Tip>
          <Tip done>JSON-LD SoftwareApplication schema for rich results</Tip>
          <Tip done>PWA manifest — installable on iOS / Android home screen</Tip>
          <Tip done>Sitemap.xml + robots.txt indexed by Google</Tip>
          <Tip done>Public author profiles & book pages crawlable</Tip>
          <Tip>Submit to ProductHunt, BetaList, IndieHackers</Tip>
          <Tip>Cross-post to r/writing, r/selfpublish, WritingCommunity</Tip>
        </ul>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs uppercase tracking-widest text-muted-foreground">{children}</div>;
}

function PosterCard({ src, filename, small }: { src: string; filename: string; small?: boolean }) {
  return (
    <div className="paper-card overflow-hidden">
      <img src={src} alt="" className={`w-full object-cover ${small ? "aspect-square" : "aspect-video"}`} loading="lazy" />
      <div className="p-2">
        <a href={src} download={filename}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent">
          <Download className="h-3 w-3" />Download
        </a>
      </div>
    </div>
  );
}

function CaptionCard({ title, body, hashtags }: { title: string; body: string; hashtags: string }) {
  const [copied, setCopied] = useState(false);
  const full = `${body}\n\n${hashtags}`;
  return (
    <div className="paper-card p-4">
      <div className="flex items-center justify-between">
        <div className="font-serif text-sm">{title}</div>
        <button
          onClick={() => { navigator.clipboard.writeText(full); setCopied(true); toast.success("Copied"); setTimeout(() => setCopied(false), 1500); }}
          className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] hover:bg-accent"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}{copied ? "Copied" : "Copy"}
        </button>
      </div>
      <Textarea value={full} readOnly className="mt-3 min-h-[110px] text-sm bg-background/50" />
    </div>
  );
}

function ShareBtn({ icon: Icon, label, href, onClick }: any) {
  const inner = (
    <>
      <Icon className="h-4 w-4" /><span className="text-sm">{label}</span>
    </>
  );
  const cls = "inline-flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2.5 hover:bg-accent";
  return href
    ? <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
    : <button onClick={onClick} className={cls}>{inner}</button>;
}

function Tip({ children, done }: { children: React.ReactNode; done?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <span className={`mt-0.5 grid h-4 w-4 place-items-center rounded-full text-[10px] ${done ? "bg-primary text-primary-foreground" : "border border-border"}`}>
        {done ? "✓" : ""}
      </span>
      <span className={done ? "text-foreground/70" : ""}>{children}</span>
    </li>
  );
}
