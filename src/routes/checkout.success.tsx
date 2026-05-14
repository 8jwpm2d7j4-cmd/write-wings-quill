import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/success")({
  component: SuccessPage,
  validateSearch: (s: Record<string, unknown>) => ({ kind: (s.kind as string) ?? "pro" }),
});

function SuccessPage() {
  const { kind } = Route.useSearch();
  const copy = kind === "tip"
    ? { title: "Thanks for tipping!", body: "Your support means the world to this writer." }
    : kind === "unlock"
    ? { title: "Chapter unlocked", body: "Refresh to keep reading where you left off." }
    : { title: "Welcome to Quill Pro", body: "Your membership is being activated. It may take a few seconds for Pro features to unlock." };
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-paper text-ink">
      <div className="max-w-sm text-center space-y-4">
        <div className="text-5xl">✦</div>
        <h1 className="font-serif text-3xl">{copy.title}</h1>
        <p className="text-ink/70">{copy.body}</p>
        <Link to="/" className="inline-block mt-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm font-medium">
          Back to your library
        </Link>
      </div>
    </div>
  );
}
