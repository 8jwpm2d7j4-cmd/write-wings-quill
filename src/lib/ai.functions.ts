import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { userIsPro } from "@/lib/membership.server";

const FREE_DAILY_ASSISTS = 5;

const assistInput = z.object({
  mode: z.enum(["continue", "rewrite", "improve", "brainstorm", "outline"]),
  context: z.string().min(1).max(20000),
  instruction: z.string().max(2000).optional().default(""),
});

const SYSTEM = `You are Quill, an expert literary co-writer for fiction and non-fiction authors.
Match the writer's voice and tense. Be vivid, specific, and concise.
Never break the fourth wall. Output prose only — no preamble, no markdown headings unless asked.`;

export const aiAssist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => assistInput.parse(d))
  .handler(async ({ data, context }) => {
    if (!(await userIsPro(context.userId))) {
      const { data: used, error: usageErr } = await context.supabase.rpc("bump_ai_usage");
      if (usageErr) throw new Error("Could not record AI usage");
      if ((used ?? 0) > FREE_DAILY_ASSISTS) {
        throw new Error(`Free plan limit reached (${FREE_DAILY_ASSISTS} AI assists/day). Upgrade to Quill Pro for unlimited.`);
      }
    }
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const model = createLovableAiGatewayProvider(key)("google/gemini-3-flash-preview");

    const prompts: Record<typeof data.mode, string> = {
      continue: `Continue the following passage naturally for 2–4 paragraphs. Preserve voice and POV.\n\n---\n${data.context}\n---\n\n${data.instruction ? "Author note: " + data.instruction : ""}`,
      rewrite: `Rewrite the following passage to be tighter and more vivid, keeping meaning and voice.\n\n${data.context}\n\n${data.instruction}`,
      improve: `Polish this passage for grammar, rhythm, and clarity. Return improved prose only.\n\n${data.context}`,
      brainstorm: `Brainstorm 5 distinct directions for what could happen next. Be concrete. One per line.\n\nContext:\n${data.context}\n\nFocus: ${data.instruction || "any"}`,
      outline: `Generate a chapter-by-chapter outline (8–12 chapters) based on this premise. Use "Chapter N — title: one-sentence beat" format.\n\n${data.context}`,
    };

    const { text } = await generateText({
      model,
      system: SYSTEM,
      prompt: prompts[data.mode],
    });
    return { text };
  });

const coverInput = z.object({
  title: z.string().min(1).max(200),
  author: z.string().max(120).optional().default(""),
  genre: z.string().max(80).optional().default(""),
  vibe: z.string().max(500).optional().default(""),
});

export const generateCover = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => coverInput.parse(d))
  .handler(async ({ data, context }) => {
    if (!(await userIsPro(context.userId))) {
      throw new Error("AI cover generation is a Quill Pro feature. Upgrade to design unlimited covers.");
    }
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const prompt = `Professional book cover illustration, 2:3 portrait composition for a ${data.genre || "literary"} novel titled "${data.title}"${data.author ? ` by ${data.author}` : ""}. ${data.vibe || "atmospheric, cinematic, painterly"}. Leave clean composition space at top for the title and bottom for the author name. Strong focal point, dramatic lighting, evocative mood. No actual text or letters in the image — text overlay added separately.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        prompt,
        size: "1024x1536",
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Cover generation failed (${res.status}): ${t.slice(0, 300)}`);
    }
    const json = await res.json() as { data?: Array<{ b64_json?: string; url?: string }> };
    const item = json.data?.[0];
    if (!item) throw new Error("No image returned");
    return {
      dataUrl: item.b64_json ? `data:image/png;base64,${item.b64_json}` : (item.url ?? ""),
    };
  });
