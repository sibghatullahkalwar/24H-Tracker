import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const MOCK_USER_ID = 'default-user';

export async function GET() {
  try {
    const activeSession = await prisma.session.findFirst({
      where: { userId: MOCK_USER_ID, isActive: true },
      include: { section: true }
    });

    return NextResponse.json({ session: activeSession || null });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active session' }, { status: 500 });
  }
}
