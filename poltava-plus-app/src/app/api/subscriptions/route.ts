import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        // Якщо email немає — повертаємо порожній масив, а не об'єкт з помилкою
        if (!email) {
            console.warn("⚠️ Спроба отримати підписки без email");
            return NextResponse.json([]);
        }

        const subs = await prisma.subscription.findMany({
            where: { userEmail: email },
            orderBy: { createdAt: "desc" },
        });

        // Prisma завжди повертає масив (навіть порожній []), тож тут все ок
        return NextResponse.json(subs);
    } catch (error) {
        console.error("❌ Помилка БД:", error);
        return NextResponse.json([]); // У разі помилки теж повертаємо масив, щоб фронт не падав
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 🔍 ЛОГ ДЛЯ ПЕРЕВІРКИ: Подивись у термінал, коли натиснеш кнопку!
        console.log("Отримані дані для підписки:", body);

        if (!body.userEmail || !body.telegramId) {
            return NextResponse.json(
                { error: "Email або Telegram ID відсутні" },
                { status: 400 },
            );
        }

        const newSub = await prisma.subscription.create({
            data: {
                telegramId: String(body.telegramId),
                groupNumber: Number(body.groupNumber),
                subscribeOutage: Boolean(body.subscribeOutage),
                subscribeAlert: Boolean(body.subscribeAlert),
                userEmail: body.userEmail, // Це поле ми додали в схему
            },
        });

        return NextResponse.json(newSub);
    } catch (error: any) {
        // Якщо тут виникне помилка Prisma — ми її побачимо в консолі
        console.error("❌ ПОМИЛКА БД ПРИ СТВОРЕННІ:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id)
            return NextResponse.json(
                { error: "ID не вказано" },
                { status: 400 },
            );

        await prisma.subscription.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Видалено успішно" });
    } catch (error) {
        return NextResponse.json(
            { error: "Помилка видалення" },
            { status: 500 },
        );
    }
}
