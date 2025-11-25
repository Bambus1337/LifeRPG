import { NextRequest, NextResponse } from "next/server";

// API endpoint to get suggested friends for a user
// TODO: Connect to real database and implement similarity algorithm

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    // TODO: Replace with real database query
    // This should:
    // 1. Get user's stats from user_stats table
    // 2. Calculate similarity scores with other users
    // 3. Return top N most similar users
    // 4. Exclude already connected friends
    
    // Placeholder data matching seed.sql structure
    const suggestedUsers = [
      {
        id: 3,
        username: "Consistent Chris",
        level: 7,
        totalXp: 2100,
        similarityScore: 85.5,
        reason: "Podobny poziom aktywności i konsekwencji",
        personaTitle: "Stabilny Odkrywca",
      },
      {
        id: 7,
        username: "Competitive Carlos",
        level: 6,
        totalXp: 1890,
        similarityScore: 78.3,
        reason: "Obaj lubicie rywalizację i jesteście aktywni",
        personaTitle: "Stabilny Odkrywca",
      },
      {
        id: 9,
        username: "Energetic Emma",
        level: 5,
        totalXp: 1420,
        similarityScore: 76.8,
        reason: "Wysoka energia i dobry stan psychiczny",
        personaTitle: "Stabilny Odkrywca",
      },
      {
        id: 5,
        username: "Motivated Maya",
        level: 6,
        totalXp: 1650,
        similarityScore: 74.2,
        reason: "Wysoka motywacja wewnętrzna",
        personaTitle: "Stabilny Odkrywca",
      },
    ];

    return NextResponse.json({ suggestedUsers }, { status: 200 });
  } catch (error) {
    console.error("Suggested friends API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggested friends" },
      { status: 500 }
    );
  }
}

