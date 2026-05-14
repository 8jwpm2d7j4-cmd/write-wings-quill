import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ title, url, text }: { title: string; url?: string; text?: string }) {
  const share = async () => {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    const data = { title, url: shareUrl, text: text ?? title };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied");
      }
    } catch {/* user dismissed */}
  };
  return (
    <button onClick={share} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent" title="Share">
      <Share2 className="h-5 w-5" />
    </button>
  );
}
