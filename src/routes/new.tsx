import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// /new — create a manuscript and jump into the editor (used by bottom-nav write button)
export const Route = createFileRoute("/new")({ component: NewWork });

function NewWork() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (started.current) return;
    started.current = true;
    (async () => {
      const { data, error } = await supabase
        .from("manuscripts")
        .insert({ author_id: user.id, title: "Untitled" })
        .select()
        .single();
      if (error || !data) {
        toast.error(error?.message ?? "Could not create");
        navigate({ to: "/" });
        return;
      }
      const { error: chapterError } = await supabase
        .from("chapters")
        .insert({ manuscript_id: data.id, title: "Chapter 1", order: 0 });
      if (chapterError) {
        await supabase.from("manuscripts").delete().eq("id", data.id);
        toast.error(chapterError.message || "Could not prepare the first chapter");
        navigate({ to: "/" });
        return;
      }
      navigate({ to: "/write/$id", params: { id: data.id }, replace: true });
    })();
  }, [user, loading, navigate]);

  return (
    <div className="grid min-h-screen place-items-center text-muted-foreground font-serif">
      Preparing your blank page…
    </div>
  );
}
