import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET() {
    try {
        const subscriptions = await prisma.subscription.findMany();
        return NextResponse.json(subscriptions, { status: 200 });
    } catch (error: any) {
        console.error("PRISMA GET ERROR:", error);
        return NextResponse.json(
            { error: "Помилка бази даних" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();


        const telegramId = String(body.telegramId); 
        const groupNumber = parseInt(body.groupNumber); 

        if (isNaN(groupNumber)) {
            throw new Error("Номер групи має бути числом");
        }

        const subscription = await prisma.subscription.upsert({
            where: { telegramId: telegramId },
            update: {
                groupNumber: groupNumber,
                subscribeAlert: Boolean(body.subscribeAlert),
                subscribeOutage: Boolean(body.subscribeOutage),
            },
            create: {
                telegramId: telegramId,
                groupNumber: groupNumber,
                subscribeAlert: Boolean(body.subscribeAlert),
                subscribeOutage: Boolean(body.subscribeOutage),
            },
        });

        return NextResponse.json(subscription, { status: 201 });
    } catch (error: any) {
        console.error("PRISMA POST ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        console.log("Спроба видалення запису з ID:", id); 

        if (!id) {
            return NextResponse.json({ error: "ID не вказано" }, { status: 400 });
        }

        // ВАЖЛИВО: Якщо в твоєму schema.prisma поле id — це Int (число),
        // то рядок з URL треба перетворити: const numericId = parseInt(id);
        
        await prisma.subscription.delete({
            where: { 
                // Якщо в базі id — це UUID або String, залишаємо так.
                // Якщо id — це число, заміни на id: parseInt(id)
                id: id 
            },
        });

        console.log("✅ Запис видалено успішно");
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("❌ PRISMA DELETE ERROR:", error.message);
        
        // Можливо, ти намагаєшся видалити за telegramId? 
        // Якщо так, спробуй змінити 'where' на: { telegramId: id }
        
        return NextResponse.json(
            { error: `Не вдалося видалити: ${error.message}` },
            { status: 500 },
        );
    }
}
