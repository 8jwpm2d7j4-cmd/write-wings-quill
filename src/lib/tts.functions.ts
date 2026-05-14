import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { userIsPro } from "@/lib/membership.server";

const input = z.object({
  text: z.string().min(1).max(4500),
  voiceId: z.string().min(1).max(64).regex(/^[a-zA-Z0-9]+$/).default("EXAVITQu4vr4xnSDxMaL"),
});

export const narrate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data, context }) => {
    if (!(await userIsPro(context.userId))) {
      throw new Error("AI narration is a Quill Pro feature. Upgrade to listen to chapters.");
    }
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) throw new Error("Missing ELEVENLABS_API_KEY");

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${data.voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
        }),
      }
    );
    if (!res.ok) throw new Error(`TTS failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
    const buf = await res.arrayBuffer();
    return { audio: Buffer.from(buf).toString("base64") };
  });
