import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ACHIEVEMENTS = {
  first_words: { title: "First Words", icon: "✍️" },
  thousand_words: { title: "Wordsmith", icon: "📜" },
  ten_thousand: { title: "Novelist", icon: "📚" },
  first_publish: { title: "Published Author", icon: "🎉" },
  streak_7: { title: "Week of Words", icon: "🔥" },
  streak_30: { title: "Month of Mastery", icon: "⚡" },
  first_tip: { title: "Patron", icon: "💝" },
  first_follower: { title: "Notable", icon: "✨" },
} as const;

export type AchievementCode = keyof typeof ACHIEVEMENTS;

export async function awardIfNew(userId: string, code: AchievementCode) {
  // Server-side validates eligibility and idempotently inserts.
  const { data, error } = await supabase.rpc("award_achievement", {
    _code: code,
    _target_user: userId,
  });
  if (error || !data) return false;
  const a = ACHIEVEMENTS[code];
  toast.success(`${a.icon} Achievement unlocked: ${a.title}`);
  return true;
}

export async function checkWritingMilestones(
  userId: string,
  totalWords: number,
  currentStreak: number,
) {
  if (totalWords >= 100) await awardIfNew(userId, "first_words");
  if (totalWords >= 1000) await awardIfNew(userId, "thousand_words");
  if (totalWords >= 10000) await awardIfNew(userId, "ten_thousand");
  if (currentStreak >= 7) await awardIfNew(userId, "streak_7");
  if (currentStreak >= 30) await awardIfNew(userId, "streak_30");
}
