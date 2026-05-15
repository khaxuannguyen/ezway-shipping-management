import { NextRequest, NextResponse } from "next/server";
import { createPickupRequest } from "../actions";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await createPickupRequest(formData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 400 }
    );
  }
}