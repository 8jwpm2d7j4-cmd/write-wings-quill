import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect, type ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { PaymentTestModeBanner } from "./PaymentTestModeBanner";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        <div className="font-serif text-lg">Opening your library…</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md min-h-screen pb-24 relative">
      <PaymentTestModeBanner />
      {children}
      {!hideNav && <BottomNav />}
    </div>
  );
}
