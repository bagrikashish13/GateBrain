import type { Metadata } from "next";
import { Suspense } from "react";
import { requireSession } from "@/lib/auth/session";
import { subjects } from "@/lib/brain/subjects";
import { getRoadmap } from "@/lib/roadmap/store";
import { daysToExam, getSettings } from "@/lib/settings";
import { dayKey } from "@/lib/time";
import { RoadmapView } from "./roadmap-view";

export const metadata: Metadata = { title: "Roadmap · GateBrain" };

export default function RoadmapPage() {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-7 overflow-x-clip px-4 pt-5 pb-10 md:max-w-[720px] lg:max-w-[1120px] lg:px-8 lg:pt-8">
      <Suspense fallback={<h1 className="display">Roadmap</h1>}>
        <Roadmap />
      </Suspense>
    </main>
  );
}

async function Roadmap() {
  await requireSession();
  const parsed = getRoadmap();
  if (!parsed || !parsed.ok) {
    return (
      <>
        <h1 className="display">Roadmap</h1>
        <p className="text-[13px] text-faint">{parsed ? `brain/roadmap.json: ${parsed.error}` : "No brain/roadmap.json yet"}</p>
      </>
    );
  }
  const settings = getSettings();
  const now = new Date();
  const subs = Object.fromEntries(subjects().map((s) => [s.key, { short: s.short, colour: s.colour }]));
  return <RoadmapView roadmap={parsed.roadmap} today={dayKey(now)} examDate={settings.examDate} examDays={daysToExam(settings, now)} subjects={subs} />;
}
