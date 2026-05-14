import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen, Sparkles } from "lucide-react";
import { redeemStoredRef } from "@/lib/referral";
import { SignupCounter } from "@/components/SignupCounter";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [penName, setPenName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      redeemStoredRef().then((r) => {
        if (r.ok) toast.success("🎉 Referral applied — 30 days of Pro added");
      });
      navigate({ to: "/" });
    }
  }, [user, navigate]);

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
        <h1 className="mt-6 font-serif text-4xl tracking-tight">Quill — Write with AI and publish for free</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write with AI. Publish for free. Be read.
        </p>
        <div className="mt-4 flex justify-center"><SignupCounter /></div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-10 w-full h-12 rounded-full"
        onClick={async () => {
          const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
          if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
        }}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.35-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
        Continue with Google
      </Button>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> or email <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-4">
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
        By continuing you agree to our{" "}
        <Link to="/terms" className="underline">Terms</Link>,{" "}
        <Link to="/privacy" className="underline">Privacy Notice</Link>, and{" "}
        <Link to="/refund-policy" className="underline">Refund Policy</Link>.
      </p>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        See <Link to="/pricing" className="underline">pricing</Link>.
      </p>
    </div>
  );
}
