import { NextResponse } from "next/server";

export async function GET() {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const CITY = "Poltava";

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric&lang=uk`;

    try {
        const res = await fetch(url, { cache: "no-store" });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Weather API Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
