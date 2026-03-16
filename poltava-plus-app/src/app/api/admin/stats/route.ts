import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "statistics data for admin"
  }, { status: 200 });
}