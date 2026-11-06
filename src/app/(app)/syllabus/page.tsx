import type { Metadata } from "next";
import { Suspense } from "react";
import { requireSession } from "@/lib/auth/session";
import { subjects } from "@/lib/brain/subjects";
import { getSyllabusTree } from "@/lib/syllabus/store";
import { SyllabusView } from "./syllabus-view";

export const metadata: Metadata = { title: "Syllabus · GateBrain" };

export default function SyllabusPage() {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-6 overflow-x-clip px-4 pt-5 pb-10 md:max-w-[720px] lg:max-w-[1120px] lg:px-8 lg:pt-8">
      <Suspense fallback={<h1 className="display">Syllabus</h1>}>
        <Syllabus />
      </Suspense>
    </main>
  );
}

async function Syllabus() {
  await requireSession();
  const loaded = getSyllabusTree(new Date());
  if (!loaded.ok) {
    return (
      <>
        <h1 className="display">Syllabus</h1>
        <p className="text-[13px] text-faint">brain/syllabus: {loaded.error}</p>
      </>
    );
  }
  const colours = Object.fromEntries(subjects().map((s) => [s.key, s.colour]));
  return <SyllabusView tree={loaded.tree} colours={colours} />;
}
