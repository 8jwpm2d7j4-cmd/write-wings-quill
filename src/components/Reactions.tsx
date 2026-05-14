import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const EMOJIS = ["❤️", "🔥", "😂", "😢", "🤯"];

export function Reactions({ chapterId }: { chapterId: string }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<Set<string>>(new Set());

  const load = async () => {
    const { data } = await supabase.from("reactions").select("emoji,user_id").eq("chapter_id", chapterId);
    const c: Record<string, number> = {};
    const m = new Set<string>();
    (data ?? []).forEach((r: any) => {
      c[r.emoji] = (c[r.emoji] ?? 0) + 1;
      if (user && r.user_id === user.id) m.add(r.emoji);
    });
    setCounts(c); setMine(m);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [chapterId, user?.id]);

  const toggle = async (emoji: string) => {
    if (!user) return;
    if (mine.has(emoji)) {
      await supabase.from("reactions").delete().eq("user_id", user.id).eq("chapter_id", chapterId).eq("emoji", emoji);
    } else {
      await supabase.from("reactions").insert({ user_id: user.id, chapter_id: chapterId, emoji });
    }
    load();
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {EMOJIS.map((e) => {
        const active = mine.has(e);
        const n = counts[e] ?? 0;
        return (
          <button
            key={e}
            onClick={() => toggle(e)}
            className={`px-2.5 py-1 rounded-full text-sm border transition ${active ? "bg-primary/15 border-primary" : "border-border hover:bg-accent"}`}
          >
            <span>{e}</span>{n > 0 && <span className="ml-1 text-xs text-muted-foreground">{n}</span>}
          </button>
        );
      })}
    </div>
  );
}
