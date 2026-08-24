import { supabase } from "@/integrations/supabase/client";

export type NotifKind = "like" | "comment" | "follow";

export async function notify(opts: {
  userId: string; // recipient
  actorId?: string | null;
  kind: NotifKind;
  message: string;
  manuscriptId?: string | null;
}) {
  if (opts.actorId && opts.actorId === opts.userId) return; // don't notify self
  const { error } = await supabase.rpc("send_notification", {
    _user_id: opts.userId,
    _kind: opts.kind,
    _message: opts.message,
    _manuscript_id: opts.manuscriptId ?? undefined,
  });
  if (error) throw error;
}
