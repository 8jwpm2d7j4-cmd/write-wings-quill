import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { FollowButton } from "@/components/FollowButton";
import { AchievementWall } from "@/components/AchievementWall";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/u/$penName")({
  component: () => (
    <AppShell>
      <Author />
    </AppShell>
  ),
  head: ({ params }) => ({
    meta: [
      { title: `${params.penName} — Quill` },
      { name: "description", content: `Books and stories by ${params.penName} on Quill.` },
      { property: "og:title", content: `${params.penName} on Quill` },
    ],
  }),
});

function Author() {
  const { penName } = Route.useParams();

  const { data: profile } = useQuery({
    queryKey: ["author-profile", penName],
    queryFn: async () =>
      (
        await supabase
          .from("profiles")
          .select("id,pen_name,bio,avatar_url,genres,created_at,updated_at")
          .eq("pen_name", penName)
          .maybeSingle()
      ).data,
  });

  const { data: books = [] } = useQuery({
    queryKey: ["author-books", profile?.id],
    enabled: !!profile,
    queryFn: async () =>
      (
        await supabase
          .from("manuscripts")
          .select("*")
          .eq("author_id", profile!.id)
          .eq("status", "published")
          .order("updated_at", { ascending: false })
      ).data ?? [],
  });

  const { data: stats } = useQuery({
    queryKey: ["author-stats", profile?.id],
    enabled: !!profile,
    queryFn: async () => {
      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", profile!.id),
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", profile!.id),
      ]);
      return { followers: followers ?? 0, following: following ?? 0 };
    },
  });

  if (!profile) {
    return <div className="px-5 pt-16 text-center text-muted-foreground">Author not found.</div>;
  }

  return (
    <div className="px-5 pt-12">
      <Link to="/discover" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Discover
      </Link>

      <div className="mt-4 flex items-start gap-3">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={`${profile.pen_name}'s avatar`}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-16 w-16 rounded-full bg-accent grid place-items-center font-serif text-xl"
          >
            {profile.pen_name[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-2xl truncate">{profile.pen_name}</h1>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {stats?.followers ?? 0} followers · {stats?.following ?? 0} following
          </div>
        </div>
        <FollowButton authorId={profile.id} size="sm" />
      </div>
      {profile.bio && <p className="mt-3 text-sm text-foreground/80">{profile.bio}</p>}

      <h2 className="mt-8 font-serif text-xl">Books</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {books.map((b) => (
          <Link key={b.id} to="/read/$id" params={{ id: b.id }} className="block">
            <div className="book-cover aspect-[2/3] overflow-hidden bg-gradient-to-br from-secondary to-muted">
              {b.cover_url ? (
                <img src={b.cover_url} alt={b.title} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center font-serif text-xs px-2 text-center">
                  {b.title}
                </div>
              )}
            </div>
            <div className="mt-2 text-sm font-serif leading-tight line-clamp-2">{b.title}</div>
            <div className="text-[11px] text-muted-foreground">
              {b.word_count?.toLocaleString()} words
            </div>
          </Link>
        ))}
        {books.length === 0 && (
          <div className="col-span-2 text-sm text-muted-foreground">No published books yet.</div>
        )}
      </div>

      <h2 className="mt-8 font-serif text-xl">Achievements</h2>
      <div className="mt-3">
        <AchievementWall userId={profile.id} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: profile.pen_name,
              description: profile.bio || undefined,
              image: profile.avatar_url || undefined,
              url: `https://write-wings-quill.lovable.app/u/${encodeURIComponent(profile.pen_name)}`,
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
