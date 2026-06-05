import { NextResponse } from "next/server";
import { addTaskComment, getTaskComments } from "@/lib/services/db";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { taskId, text } = await request.json();
    const res = await addTaskComment(taskId, text);
    if (res?.error) return NextResponse.json({ error: res.error }, { status: 400 });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");
  if (!taskId) return NextResponse.json({ error: "taskId required" }, { status: 400 });
  
  try {
    const data = await getTaskComments(taskId);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
