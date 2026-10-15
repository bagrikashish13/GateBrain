import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo, Wordmark } from "@/components/logo";
import { LoginForm, LoginFormWithNext } from "./login-form";

export const metadata: Metadata = { title: "Unlock · GateBrain" };

export default function LoginPage() {
  return (
    <main className="mx-auto grid w-full max-w-[400px] flex-1 content-center gap-10 px-5 py-12">
      <header className="grid gap-5">
        <Logo size={72} />
        <div className="grid gap-2">
          <h1 className="text-[46px] leading-[0.9]">
            <Wordmark />
          </h1>
          <p className="text-[15px] text-muted-foreground">Notes, revision, plan and mocks for GATE.</p>
        </div>
      </header>
      {/* ?next= is request data, so it streams in; the fallback is the same form without it. */}
      <Suspense fallback={<LoginForm />}>
        <LoginFormWithNext />
      </Suspense>
    </main>
  );
}
