import { NextRequest, NextResponse } from "next/server";

// Simple placeholder login API. In the future, replace with real DB-backed auth.
export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();

    if (!login || !password) {
      return NextResponse.json({ error: "Missing login or password" }, { status: 400 });
    }

    const isValid = typeof login === "string" && typeof password === "string";

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

