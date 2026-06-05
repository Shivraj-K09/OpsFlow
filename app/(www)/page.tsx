import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { IconHexagonFilled } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to OpsFlow",
  description: "Scale your internal operations intelligently.",
};

export default function Home() {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
        <div className="text-primary flex items-center gap-2">
          <IconHexagonFilled className="size-5" />
          <span className="text-foreground text-lg font-semibold tracking-tight">
            OpsFlow
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            className="h-9 rounded-full px-5 font-medium"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="h-9 rounded-full px-5 font-medium shadow-none"
          >
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 pt-10 pb-32 text-center">
        <div className="bg-muted/50 border-border text-muted-foreground mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
          <span className="bg-primary flex h-1.5 w-1.5 rounded-full"></span>
          OpsFlow is now live
        </div>

        <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
          Balance workload.
          <br />
          <span className="text-muted-foreground">Ship faster.</span>
        </h1>

        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-base leading-relaxed md:text-lg">
          The smart task management platform for operations teams. Distribute
          tasks intelligently and keep your team running at peak efficiency.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            asChild
            className="h-10 gap-2 rounded-full px-6 font-medium shadow-none"
          >
            <Link href="/register">
              Get Started <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-full px-6 font-medium shadow-none"
          >
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
