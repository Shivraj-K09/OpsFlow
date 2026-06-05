import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // Verify authentication
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch workspaces where user is a member (enforced by RLS)
  const { data: workspaces, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: workspaces });
}

import { createWorkspace } from "@/lib/services/db";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const res = await createWorkspace(formData);
    if (res?.error)
      return NextResponse.json({ error: res.error }, { status: 400 });
    revalidatePath("/");
    return NextResponse.json(res);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
