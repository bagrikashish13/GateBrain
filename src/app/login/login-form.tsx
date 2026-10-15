"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { LogIn, TriangleAlert } from "lucide-react";
import { login, type LoginState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginFormWithNext() {
  const next = useSearchParams().get("next") ?? "/";
  return <LoginForm next={next} />;
}

export function LoginForm({ next = "/" }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="passcode" className="text-[13px] font-medium text-muted-foreground">
        Passcode
      </label>
      <Input
        id="passcode"
        name="passcode"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "passcode-error" : undefined}
        inputMode="numeric"
        className="h-14 text-center font-display text-[24px] tracking-[0.5em]"
      />
      {state.error && (
        <p id="passcode-error" role="alert" className="flex items-center gap-1.5 text-[13px] text-alert">
          <TriangleAlert className="size-[15px] stroke-[1.75]" aria-hidden />
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="mt-1 h-13 text-[15px]">
        <LogIn aria-hidden />
        {pending ? "Checking…" : "Unlock"}
      </Button>
    </form>
  );
}
