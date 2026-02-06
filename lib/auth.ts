import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  company?: string;
}

// Demo users database
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'john@acmecorp.com',
    name: 'John Smith',
    plan: 'Pro',
    company: 'Acme Corp',
  },
  {
    id: '2',
    email: 'sarah@techstartup.io',
    name: 'Sarah Johnson',
    plan: 'Enterprise',
    company: 'TechStartup',
  },
  {
    id: '3',
    email: 'guest@example.com',
    name: 'Guest User',
    plan: 'Free',
  },
];

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session');
  
  if (!sessionToken) {
    return null;
  }

  try {
    const decoded = jwt.verify(sessionToken.value, process.env.JWT_SECRET || 'your-taskflow-secret') as { userId: string };
    const user = DEMO_USERS.find(u => u.id === decoded.userId);
    return user || null;
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'your-taskflow-secret', {
    expiresIn: '7d',
  });
  return token;
}

export function findUserByEmail(email: string): User | null {
  return DEMO_USERS.find(u => u.email === email) || null;
}

export function findUserById(id: string): User | null {
  return DEMO_USERS.find(u => u.id === id) || null;
}
