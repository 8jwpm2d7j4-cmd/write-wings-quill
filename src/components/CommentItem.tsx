import { Heart } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ReportButton } from "./ReportButton";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type CommentWithProfile = Database["public"]["Tables"]["comments"]["Row"] & {
  profiles: { pen_name: string } | null;
};

export function CommentItem({ comment }: { comment: CommentWithProfile }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: likes = [] } = useQuery({
    queryKey: ["clikes", comment.id],
    queryFn: async () =>
      (await supabase.from("comment_likes").select("user_id").eq("comment_id", comment.id)).data ??
      [],
  });
  const liked = !!user && likes.some((like) => like.user_id === user.id);
  const toggle = async () => {
    if (!user) {
      toast.error("Sign in to like comments");
      return;
    }
    const { error } = liked
      ? await supabase
          .from("comment_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("comment_id", comment.id)
      : await supabase.from("comment_likes").insert({ user_id: user.id, comment_id: comment.id });
    if (error) {
      toast.error("Couldn't update this comment");
      return;
    }
    qc.invalidateQueries({ queryKey: ["clikes", comment.id] });
  };

  return (
    <li className="paper-card p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium">{comment.profiles?.pen_name ?? "Reader"}</div>
        <ReportButton commentId={comment.id} label="" />
      </div>
      <p className="mt-1 text-sm text-foreground/85">{comment.body}</p>
      <button
        onClick={toggle}
        className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
      >
        <Heart className={liked ? "h-3.5 w-3.5 fill-primary text-primary" : "h-3.5 w-3.5"} />
        {likes.length || ""}
      </button>
    </li>
  );
}
