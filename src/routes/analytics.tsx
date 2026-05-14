import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, BookOpen, Heart, MessageCircle, Users, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/analytics")({ component: () => <AppShell><Analytics /></AppShell> });

function Analytics() {
  const { user } = useAuth();

  const { data: agg } = useQuery({
    queryKey: ["analytics", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [
        { data: books, count: bookCount },
        { count: followers },
        { data: tips },
        { data: dailyLog },
        { data: comments },
      ] = await Promise.all([
        supabase.from("manuscripts").select("id,title,word_count,status", { count: "exact" }).eq("author_id", user!.id),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", user!.id),
        supabase.from("tips").select("amount_cents").eq("to_user_id", user!.id),
        supabase.from("daily_word_log").select("*").eq("user_id", user!.id).order("date", { ascending: true }).limit(30),
        supabase.from("comments").select("id").in("manuscript_id", []), // placeholder
      ]);
      const bookIds = (books ?? []).map((b) => b.id);
      let likes = 0, commentsCount = 0;
      if (bookIds.length) {
        const [{ count: likesCount }, { count: cCount }] = await Promise.all([
          supabase.from("likes").select("*", { count: "exact", head: true }).in("manuscript_id", bookIds),
          supabase.from("comments").select("*", { count: "exact", head: true }).in("manuscript_id", bookIds),
        ]);
        likes = likesCount ?? 0; commentsCount = cCount ?? 0;
      }
      const tipTotal = (tips ?? []).reduce((s, t) => s + (t.amount_cents ?? 0), 0);
      return {
        books: books ?? [],
        bookCount: bookCount ?? 0,
        followers: followers ?? 0,
        likes, commentsCount, tipTotal,
        dailyLog: dailyLog ?? [],
      };
    },
  });

  return (
    <div className="px-5 pt-12">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Profile
      </Link>
      <h1 className="mt-2 font-serif text-3xl">Analytics</h1>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat icon={BookOpen} label="Published" value={agg?.books.filter((b: any) => b.status === "published").length ?? 0} />
        <Stat icon={Users} label="Followers" value={agg?.followers ?? 0} />
        <Stat icon={Heart} label="Likes" value={agg?.likes ?? 0} />
        <Stat icon={MessageCircle} label="Comments" value={agg?.commentsCount ?? 0} />
        <Stat icon={DollarSign} label="Tips earned" value={`$${((agg?.tipTotal ?? 0) / 100).toFixed(2)}`} />
        <Stat icon={BookOpen} label="Total words" value={(agg?.books ?? []).reduce((s: number, b: any) => s + (b.word_count ?? 0), 0).toLocaleString()} />
      </div>

      <h2 className="mt-8 font-serif text-xl">Last 30 days</h2>
      <div className="mt-3 paper-card p-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={agg?.dailyLog ?? []}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d?.slice(5)} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="words" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="mt-8 font-serif text-xl">Books</h2>
      <ul className="mt-3 space-y-2">
        {(agg?.books ?? []).map((b: any) => (
          <li key={b.id} className="paper-card p-3 flex items-center justify-between">
            <span className="font-serif text-sm truncate">{b.title}</span>
            <span className="text-xs text-muted-foreground">{(b.word_count ?? 0).toLocaleString()} words · {b.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="paper-card p-4">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-2 font-serif text-2xl leading-none">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
