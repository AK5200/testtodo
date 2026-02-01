import { NextResponse } from 'next/server';
import { getUser, generateFeedbackHubToken } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const token = generateFeedbackHubToken(user);
    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate token' },
      { status: 500 }
    );
  }
}
