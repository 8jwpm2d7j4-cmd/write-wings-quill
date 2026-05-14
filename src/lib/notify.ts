import { supabase } from "@/integrations/supabase/client";

export type NotifKind = "like" | "comment" | "follow" | "tip" | "unlock" | "system";

export async function notify(opts: {
  userId: string; // recipient
  actorId?: string | null;
  kind: NotifKind;
  message: string;
  manuscriptId?: string | null;
}) {
  if (opts.actorId && opts.actorId === opts.userId) return; // don't notify self
  await supabase.from("notifications").insert({
    user_id: opts.userId,
    actor_id: opts.actorId ?? null,
    kind: opts.kind,
    message: opts.message,
    manuscript_id: opts.manuscriptId ?? null,
  });
}
