import { Heart } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ReportButton } from "./ReportButton";

export function CommentItem({ comment }: { comment: any }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: likes = [] } = useQuery({
    queryKey: ["clikes", comment.id],
    queryFn: async () => (await supabase.from("comment_likes").select("user_id").eq("comment_id", comment.id)).data ?? [],
  });
  const liked = !!user && likes.some((l: any) => l.user_id === user.id);
  const toggle = async () => {
    if (!user) return;
    if (liked) await supabase.from("comment_likes").delete().eq("user_id", user.id).eq("comment_id", comment.id);
    else await supabase.from("comment_likes").insert({ user_id: user.id, comment_id: comment.id });
    qc.invalidateQueries({ queryKey: ["clikes", comment.id] });
  };

  return (
    <li className="paper-card p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium">{comment.profiles?.pen_name ?? "Reader"}</div>
        <ReportButton commentId={comment.id} label="" />
      </div>
      <p className="mt-1 text-sm text-foreground/85">{comment.body}</p>
      <button onClick={toggle} className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
        <Heart className={liked ? "h-3.5 w-3.5 fill-primary text-primary" : "h-3.5 w-3.5"} />
        {likes.length || ""}
      </button>
    </li>
  );
}
