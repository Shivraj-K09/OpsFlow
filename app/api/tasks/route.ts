import { NextResponse } from "next/server";
import { getWorkspaceTasks, createTask } from "@/lib/services/db";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId is required" },
      { status: 400 },
    );
  }

  try {
    const data = await getWorkspaceTasks(workspaceId);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const workspaceId = formData.get("workspaceId") as string;
    const res = await createTask(formData, workspaceId);
    if (res?.error)
      return NextResponse.json({ error: res.error }, { status: 400 });
    revalidatePath("/");
    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
