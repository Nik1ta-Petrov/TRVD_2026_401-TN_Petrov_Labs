import { NextResponse } from "next/server";
import { SubscriptionService } from "@/services/SubscriptionService";

// GET-запит
export async function GET() {
  try {
    const subscriptions = await SubscriptionService.getAllSubscriptions();
    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Помилка отримання даних" }, { status: 500 });
  }
}

// POST-запит
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newSubscription = await SubscriptionService.subscribe({
      telegramId: body.telegramId,
      username: body.username,
      groupNumber: body.groupNumber,
      subscribeAlert: body.subscribeAlert,
      subscribeOutage: body.subscribeOutage,
    });

    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}