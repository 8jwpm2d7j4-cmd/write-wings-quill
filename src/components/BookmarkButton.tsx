import { Bookmark } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function BookmarkButton({ manuscriptId }: { manuscriptId: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["bookmark", manuscriptId, user?.id],
    queryFn: async () =>
      (
        await supabase
          .from("bookmarks")
          .select("manuscript_id")
          .eq("user_id", user!.id)
          .eq("manuscript_id", manuscriptId)
          .maybeSingle()
      ).data,
    enabled: !!user,
  });
  const saved = !!data;

  const toggle = async () => {
    if (!user) {
      toast.error("Sign in to save");
      return;
    }
    if (saved) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("manuscript_id", manuscriptId);
      toast.success("Removed from saved");
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, manuscript_id: manuscriptId });
      toast.success("Saved to library");
    }
    qc.invalidateQueries({ queryKey: ["bookmark", manuscriptId] });
    qc.invalidateQueries({ queryKey: ["bookmarks"] });
  };
  return (
    <button
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent"
      title={saved ? "Saved" : "Save for later"}
    >
      <Bookmark className={saved ? "h-5 w-5 fill-primary text-primary" : "h-5 w-5"} />
    </button>
  );
}
