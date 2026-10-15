import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-4 px-4 pt-12">
      <span className="num text-[64px] leading-none font-bold text-line-2">404</span>
      <h1 className="display">Nothing here</h1>
      <p className="text-[15px] text-muted-foreground">That page, note or test doesn&apos;t exist.</p>
      <Link href="/" className="flex min-h-11 w-fit items-center gap-1.5 text-[14px] font-medium text-muted-foreground hover:text-fg">
        <ArrowLeft className="size-4 stroke-[1.75]" aria-hidden />
        Back to Today
      </Link>
    </main>
  );
}
