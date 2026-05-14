import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { awardIfNew } from "@/lib/achievements";
import { notify } from "@/lib/notify";

export function FollowButton({ authorId, size = "default" }: { authorId: string; size?: "sm" | "default" }) {
  const { user } = useAuth();
  const [following, setFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user || user.id === authorId) { setFollowing(false); return; }
    supabase.from("follows").select("follower_id").eq("follower_id", user.id).eq("following_id", authorId).maybeSingle()
      .then(({ data }) => setFollowing(!!data));
  }, [user, authorId]);

  if (!user || user.id === authorId) return null;

  const toggle = async () => {
    if (!user) return;
    if (following) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", authorId);
      setFollowing(false);
    } else {
      const { error } = await supabase.from("follows").insert({ follower_id: user.id, following_id: authorId });
      if (error) { toast.error(error.message); return; }
      setFollowing(true);
      // Award the followed author the "first follower" badge if applicable
      awardIfNew(authorId, "first_follower").catch(() => {});
      notify({ userId: authorId, actorId: user.id, kind: "follow", message: "You have a new follower" }).catch(() => {});
    }
  };

  return (
    <Button size={size} onClick={toggle} variant={following ? "outline" : "default"} className="rounded-full">
      {following ? <><UserCheck className="mr-1.5 h-4 w-4" /> Following</> : <><UserPlus className="mr-1.5 h-4 w-4" /> Follow</>}
    </Button>
  );
}
