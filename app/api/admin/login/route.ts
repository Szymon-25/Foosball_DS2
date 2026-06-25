import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { eventConfig } from '@/config/event';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === eventConfig.adminPassword) {
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
