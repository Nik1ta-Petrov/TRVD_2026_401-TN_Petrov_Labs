import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isSubscriptionRoute = pathname.startsWith('/api/subscriptions');

  const isAdminRoute = pathname.startsWith('/api/admin');

  if (isSubscriptionRoute || isAdminRoute) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Доступ заборонено (немає токена)' }, 
        { status: 401 }
      );
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-123');
      const { payload } = await jose.jwtVerify(token, secret);

      // RBAC

      if (isAdminRoute && payload.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Доступ заборонено: у вас роль USER, а потрібна ADMIN' }, 
          { status: 403 }
        );
      }

      if (isSubscriptionRoute && request.method === 'DELETE' && payload.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Недостатньо прав для видалення (потрібен ADMIN)' }, 
          { status: 403 }
        );
      }

      return NextResponse.next();
      
    } catch (err) {
      return NextResponse.json(
        { error: 'Невалідний або протермінований токен' }, 
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};