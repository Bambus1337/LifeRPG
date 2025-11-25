// Placeholder API route for saving quiz answers.
// In a real app you'd validate the payload and store it in a database.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic shape validation – you can extend this later as needed
        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // For now, just echo the payload back and pretend it was saved
        return NextResponse.json(
            {
                status: "ok",
                receivedAt: new Date().toISOString(),
                payload: body,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Quiz API error", error);
        return NextResponse.json(
            { error: "Failed to process quiz results" },
            { status: 500 }
        );
    }
}

