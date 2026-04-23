import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const CITY = "Poltava";
  // Використовуємо forecast замість weather
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric&lang=uk`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    // Повертаємо весь масив прогнозів
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}