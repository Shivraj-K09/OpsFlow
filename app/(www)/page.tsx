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
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 sm:px-8 py-5 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-primary">
          <IconHexagonFilled className="size-5" />
          <span className="font-semibold text-lg tracking-tight text-foreground">
            OpsFlow
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            className="rounded-full h-9 px-5 font-medium"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full h-9 px-5 font-medium shadow-none"
          >
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto w-full pb-32 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-xs font-medium text-muted-foreground mb-8">
          <span className="flex h-1.5 w-1.5 rounded-full bg-primary"></span>
          OpsFlow is now live
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Balance workload.
          <br />
          <span className="text-muted-foreground">Ship faster.</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          The smart task management platform for operations teams. Distribute
          tasks intelligently and keep your team running at peak efficiency.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            asChild
            className="gap-2 shadow-none h-10 px-6 rounded-full font-medium"
          >
            <Link href="/register">
              Get Started <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="shadow-none h-10 px-6 rounded-full font-medium"
          >
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
