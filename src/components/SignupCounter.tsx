import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

export function SignupCounter({ className = "" }: { className?: string }) {
  const { data } = useQuery({
    queryKey: ["member-count"],
    queryFn: async () => {
      const { data } = await supabase.rpc("public_member_count");
      return (data as number | null) ?? 0;
    },
    refetchInterval: 60_000,
  });
  const n = data ?? 0;
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <Users className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-medium">{n.toLocaleString()}</span>
      <span className="text-muted-foreground">writers on Quill</span>
    </div>
  );
}
