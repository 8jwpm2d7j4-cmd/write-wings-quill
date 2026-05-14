import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/success")({
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-paper text-ink">
      <div className="max-w-sm text-center space-y-4">
        <div className="text-5xl">✦</div>
        <h1 className="font-serif text-3xl">Welcome to Quill Pro</h1>
        <p className="text-ink/70">
          Your membership is being activated. It may take a few seconds for Pro features to unlock.
        </p>
        <Link
          to="/contests"
          className="inline-block mt-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm font-medium"
        >
          Enter a contest
        </Link>
      </div>
    </div>
  );
}
