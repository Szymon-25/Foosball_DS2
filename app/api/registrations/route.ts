import { NextResponse } from 'next/server';
import { getRegistrations } from '@/lib/db';

export const revalidate = 0; // Disable caching

export async function GET() {
  try {
    const registrations = await getRegistrations();
    const publicRegistrations = registrations
      .filter(r => r.status === 'accepted' || r.status === 'pending')
      .map(r => ({
        id: r.id,
        teamName: r.teamName,
        format: r.format,
        skill: r.skill,
        status: r.status
      })); // Omit secret phrase
      
    return NextResponse.json({ registrations: publicRegistrations });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
