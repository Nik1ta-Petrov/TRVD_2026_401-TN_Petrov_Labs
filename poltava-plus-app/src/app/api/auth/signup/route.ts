import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {

        const { email, username, password } = await request.json();

        if (!email || !password || !username) {
            return NextResponse.json(
                { error: "Введіть email, нікнейм та пароль" },
                { status: 400 },
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Користувач із таким email вже існує" },
                { status: 400 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                username, 
                password: hashedPassword,
                role: "USER",
            },
        });

        return NextResponse.json(
            {
                token: "fake-jwt-token-for-lab", 
                user: {
                    email: newUser.email,
                    username: newUser.username,
                },
            },
            { status: 201 },
        );
    } catch (error: any) {
        console.error("ERROR_PRISMA:", error.message);
        return NextResponse.json(
            { error: "SERVER_ERROR: " + error.message },
            { status: 500 },
        );
    }
}
