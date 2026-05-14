import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen, Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [penName, setPenName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/" }); }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { pen_name: penName || email.split("@")[0] } },
        });
        if (error) throw error;
        toast.success("Welcome to Quill ✨");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pt-16 pb-10">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-cover">
          <BookOpen className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-serif text-4xl tracking-tight">Quill</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write with AI. Publish for free. Be read.
        </p>
      </div>

      <form onSubmit={submit} className="mt-10 space-y-4">
        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="pen">Pen name</Label>
            <Input id="pen" value={penName} onChange={(e) => setPenName(e.target.value)} placeholder="J. R. Writer" />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw">Password</Label>
          <Input id="pw" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy} className="w-full h-12 text-base rounded-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {busy ? "Please wait…" : mode === "signup" ? "Start writing" : "Sign in"}
        </Button>
      </form>

      <button
        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        className="mt-6 text-sm text-muted-foreground hover:text-foreground"
      >
        {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
      </button>

      <p className="mt-auto pt-10 text-center text-xs text-muted-foreground">
        By continuing you agree to write something true.
      </p>
    </div>
  );
}
