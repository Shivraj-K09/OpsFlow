import { NextResponse } from "next/server";
import { updateWorkspace, deleteWorkspace } from "@/lib/services/db";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const formData = await request.formData();
    const res = await updateWorkspace(formData, id);
    if (res?.error)
      return NextResponse.json({ error: res.error }, { status: 400 });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const res = await deleteWorkspace(id);
    if (res?.error)
      return NextResponse.json({ error: res.error }, { status: 400 });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
