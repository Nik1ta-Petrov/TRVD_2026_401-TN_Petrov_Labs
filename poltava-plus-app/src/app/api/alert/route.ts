import { NextResponse } from 'next/server';

const ALERTS_API_URL = "https://alerts.in.ua/api/v1/alerts/active.json";

export async function GET() {
  try {
    const response = await fetch(ALERTS_API_URL, {
      method: 'GET',
      headers: {
        // alerts.in.ua
        'Authorization': `Bearer ${process.env.ALERTS_API_TOKEN}`, 
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      console.warn("API тривог недоступне. Статус:", response.status);
      return NextResponse.json({ 
        isAlert: false, 
        location: "Полтава",
        status: "Unknown (API Busy)" 
      });
    }

    const data = await response.json();

    const poltavaAlert = data.alerts.find((alert: any) => 
      alert.location_title === "Полтавська область" || 
      alert.location_title === "Полтава"
    );

    return NextResponse.json({
      isAlert: !!poltavaAlert, 
      started_at: poltavaAlert ? poltavaAlert.started_at : null,
      type: poltavaAlert ? poltavaAlert.alert_type : "none",
      location: "Полтавська область",
      last_update: new Date().toISOString()
    });

  } catch (error) {
    console.error("помилка API тривог:", error);

    return NextResponse.json({ 
      isAlert: false, 
      location: "Полтава", 
      error: "Connection failed" 
    });
  }
}