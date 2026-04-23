import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. ПУБЛІЧНІ МАРШРУТИ
  // Дозволяємо доступ до погоди всім без винятку
  if (pathname.startsWith('/api/weather')) {
    return NextResponse.next();
  }

  const isSubscriptionRoute = pathname.startsWith('/api/subscriptions');
  const isAdminRoute = pathname.startsWith('/api/admin');

  // 2. ЗАХИЩЕНІ МАРШРУТИ
  if (isSubscriptionRoute || isAdminRoute) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    // Перевірка наявності токена
    if (!token) {
      return NextResponse.json(
        { error: 'Доступ заборонено: токен відсутній. Будь ласка, увійдіть в систему.' }, 
        { status: 401 }
      );
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-123');
      const { payload } = await jose.jwtVerify(token, secret);

      // --- RBAC (Контроль доступу на основі ролей) ---

      // Захист адмін-панелі: тільки для ADMIN
      if (isAdminRoute && payload.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Доступ заборонено: потрібні права адміністратора.' }, 
          { status: 403 }
        );
      }

      // Для підписок (subscriptions) ми дозволяємо доступ і USER, і ADMIN.
      // (Видалення тепер доступне всім залогіненим юзерам)

      return NextResponse.next();
      
    } catch (err) {
      // Якщо токен протермінований або невалідний
      return NextResponse.json(
        { error: 'Ваша сесія закінчилася або токен невалідний. Увійдіть заново.' }, 
        { status: 401 }
      );
    }
  }

  // Для всіх інших маршрутів (головна, новини тощо) пропускаємо запит
  return NextResponse.next();
}

// Налаштування: які саме маршрути має обробляти middleware
export const config = {
  matcher: [
    '/api/subscriptions/:path*', 
    '/api/admin/:path*',
    '/api/weather/:path*' // Додаємо сюди, щоб middleware знав про цей шлях
  ],
};