import { NextResponse } from 'next/server';
import { getRegistrations, addRegistration, Registration } from '@/lib/db';
import { eventConfig } from '@/config/event';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamName, format, skill, secretPhrase } = body;

    if (!teamName || !format || !skill || !secretPhrase) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const deadline = new Date(eventConfig.registrationDeadline).getTime();
    if (new Date().getTime() >= deadline) {
      return NextResponse.json({ error: 'Registration closed.' }, { status: 403 });
    }

    const registrations = await getRegistrations();
    const existingTeam = registrations.find(r => r.teamName.toLowerCase() === teamName.toLowerCase());
    
    if (existingTeam) {
      return NextResponse.json({ error: 'Name taken.' }, { status: 409 });
    }

    const newRegistration: Registration = {
      id: crypto.randomUUID(),
      teamName,
      format,
      skill,
      secretPhrase,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await addRegistration(newRegistration);

    return NextResponse.json({ success: true, id: newRegistration.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
