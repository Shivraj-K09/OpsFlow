import { NextResponse } from "next/server";
import { getActivityLogs } from "@/lib/services/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : 1000;

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId is required" },
      { status: 400 },
    );
  }

  try {
    const data = await getActivityLogs(workspaceId, page, limit);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
