import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  IconHexagonFilled,
  IconLogin,
  IconUserPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { AcceptInviteButton } from "@/components/accept-invite-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Workspace",
  description: "You have been invited to join a workspace on OpsFlow",
};

export default async function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const shortId = (await params).id;
  const supabase = await createClient();

  // 1. Resolve short ID to full Workspace
  const { data } = await supabase
    .rpc("get_workspace_by_short_id", { short_id: shortId })
    .single();
  const workspace = data as {
    id: string;
    name: string;
    icon: string | null;
  } | null;

  if (!workspace) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <IconHexagonFilled className="size-6" />
          </div>
          <h1 className="text-xl font-semibold">Invalid Invite Link</h1>
          <p className="text-muted-foreground text-sm">
            This invite link is invalid or the workspace has been deleted.
          </p>
          <Button asChild className="mt-4 h-11 rounded-full px-8">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 2. Check Authentication
  const { data: userData } = await supabase.auth.getUser();
  const nextParam = encodeURIComponent(`/invite/${shortId}`);

  if (!userData?.user) {
    return (
      <div className="bg-background/50 flex min-h-screen flex-col items-center justify-center p-6">
        <div className="bg-card border-border/50 flex w-full max-w-[400px] flex-col items-center gap-6 rounded-2xl border p-8 text-center shadow-sm">
          <div className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-2xl shadow-inner">
            <IconHexagonFilled className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              You&apos;ve been invited
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You have been invited to join the{" "}
              <strong className="text-foreground">{workspace.name}</strong>{" "}
              workspace on OpsFlow.
            </p>
          </div>
          <div className="mt-4 flex w-full flex-col gap-3">
            <Button
              asChild
              className="h-11 w-full rounded-lg"
              variant="default"
            >
              <Link href={`/login?next=${nextParam}`}>
                <IconLogin className="mr-2 size-4" />
                Log in to accept
              </Link>
            </Button>
            <Button
              asChild
              className="h-11 w-full rounded-lg"
              variant="outline"
            >
              <Link href={`/register?next=${nextParam}`}>
                <IconUserPlus className="mr-2 size-4" />
                Create an account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is Authenticated, check if already member
  const { data: isMember } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspace.id)
    .eq("user_id", userData.user.id)
    .single();

  if (isMember) {
    // Already a member, update cookie and redirect
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.set("active_workspace", workspace.id, { path: "/" });
    redirect("/dashboard");
  }

  // 4. Authenticated but not a member, show Accept button

  return (
    <div className="bg-background/50 flex min-h-screen flex-col items-center justify-center p-6">
      <div className="bg-card border-border/50 flex w-full max-w-[400px] flex-col items-center gap-6 rounded-2xl border p-8 text-center shadow-sm">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-inner">
          <IconHexagonFilled className="size-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Join Workspace
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You are signed in as{" "}
            <strong className="text-foreground">{userData.user.email}</strong>.
            Would you like to join the{" "}
            <strong className="text-foreground">{workspace.name}</strong>{" "}
            workspace?
          </p>
        </div>
        <div className="mt-4 w-full">
          <AcceptInviteButton workspaceId={workspace.id} />
        </div>
      </div>
    </div>
  );
}
