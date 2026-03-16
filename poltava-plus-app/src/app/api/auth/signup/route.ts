import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma'; 

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Введіть email та пароль' }, 
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Користувач із таким email вже існує' }, 
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER', 
      },
    });

    return NextResponse.json(
      { message: 'Користувач успішно створений', userId: newUser.id }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Помилка реєстрації:', error);
    return NextResponse.json(
      { error: 'Помилка сервера при реєстрації' }, 
      { status: 500 }
    );
  }
}