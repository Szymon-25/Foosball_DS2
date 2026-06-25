import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getRegistrations } from '@/lib/db';

export const revalidate = 0;

export async function GET() {
  const cookieStore = cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const registrations = await getRegistrations();
    // Sort so newest is first or leave as is
    return NextResponse.json({ registrations });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
