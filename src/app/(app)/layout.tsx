import { Suspense } from "react";
import { TabBar, TabBarView } from "@/components/tab-bar";

// Signed-in screens: content above a fixed bottom tab bar on a phone, beside a side rail on a laptop.
// (The exam screen lives outside, full-screen.)
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="flex flex-1 flex-col pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0 lg:pl-56">{children}</div>
      <Suspense fallback={<TabBarView pathname={null} />}>
        <TabBar />
      </Suspense>
    </>
  );
}
