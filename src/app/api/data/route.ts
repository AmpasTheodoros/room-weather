import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  await redis.set('latest-room-data', data);
  return NextResponse.json({ message: 'Data stored' });
}

export async function GET() {
  const data = await redis.get('latest-room-data');
  return NextResponse.json(data || { message: 'No data yet' });
}
