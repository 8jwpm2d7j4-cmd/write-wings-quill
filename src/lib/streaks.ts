import { supabase } from "@/integrations/supabase/client";
import { awardIfNew } from "./achievements";

/** Pings reading streak. Increments if last_read_date is yesterday, resets if older, no-op if today. */
export async function pingReadingStreak(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("reading_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    await supabase.from("reading_streaks").insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_read_date: today,
    });
    return { current: 1 };
  }
  if (data.last_read_date === today) return { current: data.current_streak };
  const last = data.last_read_date ? new Date(data.last_read_date) : null;
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const isYesterday = last && last.toISOString().slice(0, 10) === yest.toISOString().slice(0, 10);
  const next = isYesterday ? data.current_streak + 1 : 1;
  const longest = Math.max(data.longest_streak ?? 0, next);
  await supabase
    .from("reading_streaks")
    .update({
      current_streak: next,
      longest_streak: longest,
      last_read_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
  return { current: next };
}

/** Logs writing words for today, increments streak on first write of day. */
export async function logWritingDay(userId: string, totalWords: number) {
  const today = new Date().toISOString().slice(0, 10);
  // Upsert daily total
  await supabase
    .from("daily_word_log")
    .upsert({ user_id: userId, date: today, words: totalWords }, { onConflict: "user_id,date" });

  const { data: g } = await supabase
    .from("writing_goals")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (!g) return;
  if (g.last_logged_date === today) return;
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const last = g.last_logged_date ? new Date(g.last_logged_date) : null;
  const isYesterday = last && last.toISOString().slice(0, 10) === yest.toISOString().slice(0, 10);
  const next = isYesterday ? (g.current_streak ?? 0) + 1 : 1;
  const longest = Math.max(g.longest_streak ?? 0, next);
  await supabase
    .from("writing_goals")
    .update({
      current_streak: next,
      longest_streak: longest,
      last_logged_date: today,
      total_words: totalWords,
    })
    .eq("user_id", userId);
  if (next >= 7) awardIfNew(userId, "streak_7");
  if (next >= 30) awardIfNew(userId, "streak_30");
}
