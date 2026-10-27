import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Online membership payments are currently unavailable." },
    { status: 410 }
  );
}
