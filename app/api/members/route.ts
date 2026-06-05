import { NextResponse } from "next/server";
import { getWorkspaceMembers } from "@/lib/services/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId is required" },
      { status: 400 }
    );
  }

  try {
    const data = await getWorkspaceMembers(workspaceId);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
