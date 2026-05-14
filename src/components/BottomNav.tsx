import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, Compass, PenSquare, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = { to: string; label: string; icon: typeof BookOpen; highlight?: boolean };
const tabs: Tab[] = [
  { to: "/", label: "Library", icon: BookOpen },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/new", label: "Write", icon: PenSquare, highlight: true },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/profile", label: "You", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/90 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto max-w-md grid grid-cols-5">
        {tabs.map(({ to, label, icon: Icon, highlight }) => {
          const active = pathname === to || (to !== "/" && pathname.startsWith(to));
          return (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium tracking-wide uppercase transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid place-items-center transition-all",
                    highlight
                      ? "h-10 w-10 rounded-full bg-primary text-primary-foreground -mt-4 shadow-cover"
                      : "h-6 w-6",
                  )}
                  style={highlight ? { boxShadow: "var(--shadow-cover)" } : undefined}
                >
                  <Icon className={highlight ? "h-5 w-5" : "h-5 w-5"} strokeWidth={active || highlight ? 2.4 : 1.8} />
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
