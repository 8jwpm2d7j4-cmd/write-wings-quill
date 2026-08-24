import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [{ title: "Payment complete — Quill" }, { name: "robots", content: "noindex" }],
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id } = Route.useSearch();
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Check className="h-7 w-7" />
      </div>
      <h1 className="mt-4 font-serif text-3xl">Thank you ✦</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {session_id
          ? "Your payment is complete. It may take a few seconds for your account to update."
          : "Your session is complete."}
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link to="/">
          <Button className="w-full rounded-full">
            <BookOpen className="mr-2 h-4 w-4" /> Back to Quill
          </Button>
        </Link>
      </div>
    </div>
  );
}
