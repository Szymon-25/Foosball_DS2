import fs from 'fs/promises';
import path from 'path';

export type RegistrationStatus = 'pending' | 'accepted' | 'rejected';
export type Format = 'Solo' | '2 people';

export interface Registration {
  id: string;
  teamName: string;
  format: Format;
  skill: number;
  secretPhrase: string;
  status: RegistrationStatus;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'registrations.json');

export async function getRegistrations(): Promise<Registration[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data).registrations;
  } catch {
    return [];
  }
}

export async function saveRegistrations(registrations: Registration[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify({ registrations }, null, 2));
}

export async function addRegistration(registration: Registration) {
  const registrations = await getRegistrations();
  registrations.push(registration);
  await saveRegistrations(registrations);
}

export async function updateRegistrationStatus(id: string, status: RegistrationStatus) {
  const registrations = await getRegistrations();
  const index = registrations.findIndex(r => r.id === id);
  if (index !== -1) {
    registrations[index].status = status;
    await saveRegistrations(registrations);
    return true;
  }
  return false;
}
