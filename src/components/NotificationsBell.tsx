import { Bell, Check } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export function NotificationsBell() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () =>
      (
        await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(50)
      ).data ?? [],
    enabled: !!user,
    refetchInterval: 30000,
  });

  const unread = items.filter((notification) => !notification.read).length;

  const markAll = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    if (error) {
      toast.error("Couldn't mark notifications as read");
      return;
    }
    qc.invalidateQueries({ queryKey: ["notifications", user.id] });
  };

  if (!user) return null;
  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o && unread) markAll();
      }}
    >
      <SheetTrigger asChild>
        <button
          className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="font-serif">Notifications</SheetTitle>
        </SheetHeader>
        <ul className="mt-6 space-y-2">
          {items.length === 0 && (
            <li className="paper-card p-6 text-center text-sm text-muted-foreground">
              You're all caught up.
            </li>
          )}
          {items.map((n) => (
            <li key={n.id} className="paper-card p-3 flex items-start gap-3">
              <div className="mt-1">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{n.message}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
