import { NextResponse } from "next/server";
import { updateMemberRole } from "@/lib/services/db";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { role, workspaceId } = await request.json();
    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
    }
    const res = await updateMemberRole(id, role, workspaceId);
    if (res?.error) return NextResponse.json({ error: res.error }, { status: 400 });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
