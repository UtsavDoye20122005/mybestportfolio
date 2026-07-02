import { NextResponse } from "next/server";
import { getVisitorCount, incrementVisitorCount } from "@/lib/visitor/storage";

export async function POST() {
  try {
    const nextCount = await incrementVisitorCount();
    return NextResponse.json({ value: nextCount });
  } catch (error) {
    return NextResponse.json({ error: "Unable to update visitor count" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const currentCount = await getVisitorCount();
    return NextResponse.json({ value: currentCount });
  } catch (error) {
    return NextResponse.json({ error: "Unable to read visitor count" }, { status: 500 });
  }
}
