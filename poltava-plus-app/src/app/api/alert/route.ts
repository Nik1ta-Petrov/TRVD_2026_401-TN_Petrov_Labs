import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://ubilling.net.ua/aerialalerts/',
      { cache: 'no-store' }
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch alert data' }, { status: 500 });
  }
}