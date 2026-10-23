import type { Metadata } from "next";
import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { Logo, Wordmark } from "@/components/logo";
import { SubjectMarker } from "@/components/subject-marker";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { requireSession } from "@/lib/auth/session";
import { notesTree } from "@/lib/brain/notes";
import { subjects } from "@/lib/brain/subjects";
import { syncStatus } from "@/lib/repo/git";
import { getSettings } from "@/lib/settings";
import { SyncButton } from "../sync-button";
import { SettingsForm } from "./settings-form";
import { ThemePicker } from "./theme-picker";

export const metadata: Metadata = { title: "Settings · GateBrain" };

export default function SettingsPage() {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-7 px-4 pt-5 pb-8 md:max-w-[560px] lg:pt-8">
      <Suspense fallback={<h1 className="display">Settings</h1>}>
        <Settings />
      </Suspense>
    </main>
  );
}

const ago = (t: number | null) => {
  if (!t) return "not yet";
  const m = Math.round((Date.now() - t) / 60_000);
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`;
};

async function Settings() {
  await requireSession();
  const s = getSettings();
  const sync = await syncStatus();
  const studied = new Set(notesTree().map((f) => f.name));

  return (
    <>
      <div className="-mt-3 grid gap-1">
        <BackLink fallback="/" label="Today" />
        <h1 className="display">Settings</h1>
      </div>

      <section className="grid gap-3" aria-label="Theme">
        <h2 className="label">Theme</h2>
        <ThemePicker current={s.theme} />
      </section>

      <section className="grid gap-3" aria-label="Exam">
        <h2 className="label">Exam</h2>
        <SettingsForm examDate={s.examDate} newPerDay={s.newPerDay} />
      </section>

      <section className="grid gap-2" aria-label="Sync">
        <div className="flex items-center justify-between">
          <h2 className="label">GitHub</h2>
          <div className="-my-2 -mr-2">
            <SyncButton />
          </div>
        </div>
        <dl className="grid border-t border-line text-[13.5px]">
          {[
            { k: "Last pull", v: ago(sync.lastPull) },
            { k: "Last push", v: ago(sync.lastPush) },
            { k: "Waiting to push", v: sync.ahead ? `${sync.ahead} ${sync.ahead === 1 ? "change" : "changes"}` : "nothing", alert: sync.ahead > 0 },
            { k: "Token", v: process.env.GITHUB_TOKEN ? "set" : "this machine's git login" },
          ].map((r) => (
            <div key={r.k} className="flex justify-between gap-3 border-b border-line py-2.5">
              <dt className="text-muted-foreground">{r.k}</dt>
              <dd className={r.alert ? "text-alert" : "text-fg"}>{r.v}</dd>
            </div>
          ))}
        </dl>
        {sync.error && <p className="text-[12.5px] break-words text-alert">{sync.error}</p>}
      </section>

      <section className="grid gap-2" aria-label="Subject colours">
        <h2 className="label">Subject colours</h2>
        <ul className="grid grid-cols-2 gap-x-4 border-t border-line">
          {subjects().map((x) => (
            <li key={x.key} className="flex min-h-10 items-center gap-2.5 border-b border-line text-[13px]">
              <SubjectMarker colour={x.colour} />
              <span className={studied.has(x.key) ? "text-fg" : "text-faint"}>{x.short}</span>
              <span className="ml-auto truncate font-mono text-[11px] text-faint">#{x.key}</span>
            </li>
          ))}
        </ul>
      </section>

      <form action={logout}>
        <Button type="submit" variant="outline" className="w-full">
          <LogOut aria-hidden />
          Lock
        </Button>
      </form>

      <footer className="flex items-center gap-2.5 pt-2 text-faint">
        <Logo size={22} />
        <Wordmark className="text-[14px]" />
      </footer>
    </>
  );
}
