import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AchievementWall({ userId }: { userId: string }) {
  const [items, setItems] = useState<
    Array<{ code: string; title: string; icon: string; description: string; earned: boolean }>
  >([]);

  useEffect(() => {
    (async () => {
      const [{ data: all }, { data: mine }] = await Promise.all([
        supabase.from("achievements").select("*"),
        supabase.from("user_achievements").select("code").eq("user_id", userId),
      ]);
      const earned = new Set((mine ?? []).map((item) => item.code));
      setItems(
        (all ?? []).map((achievement) => ({
          ...achievement,
          earned: earned.has(achievement.code),
        })),
      );
    })();
  }, [userId]);

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((a) => (
        <div
          key={a.code}
          title={`${a.title} — ${a.description}`}
          className={`paper-card p-3 text-center transition ${a.earned ? "" : "opacity-30 grayscale"}`}
        >
          <div className="text-2xl">{a.icon}</div>
          <div className="mt-1 text-[10px] font-medium leading-tight">{a.title}</div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="col-span-4 text-xs text-muted-foreground">Loading achievements…</p>
      )}
    </div>
  );
}
