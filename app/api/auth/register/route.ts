import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const data = {
      email: body.email,
      password: body.password,
      options: {
        data: {
          full_name: body.name,
        },
      },
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
