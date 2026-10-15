import { WifiOff } from "lucide-react";

// Served by the service worker when a page isn't cached and there's no network.
export default function OfflinePage() {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-4 px-4 pt-12">
      <WifiOff className="size-8 stroke-[1.5] text-faint" aria-hidden />
      <h1 className="display">No connection</h1>
      <p className="text-[15px] text-muted-foreground">Notes you opened before still work offline. Revising, ticking and tests need the network.</p>
    </main>
  );
}
