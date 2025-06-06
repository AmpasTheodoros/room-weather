import { NextRequest, NextResponse } from 'next/server';

let latestData: any = null;

export async function POST(req: NextRequest) {
  const data = await req.json();
  latestData = data;
  console.log("📡 Data received:", data);
  return NextResponse.json({ message: "Data received" });
}

export async function GET() {
  return NextResponse.json(latestData || { message: "No data yet" });
}
