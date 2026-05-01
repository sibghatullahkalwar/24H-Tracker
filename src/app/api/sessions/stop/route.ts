import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const MOCK_USER_ID = 'default-user';

export async function POST() {
  try {
    const now = new Date();

    // Find the currently active session
    const activeSession = await prisma.session.findFirst({
      where: { userId: MOCK_USER_ID, isActive: true },
    });

    if (!activeSession) {
      return NextResponse.json({ error: 'No active session found' }, { status: 404 });
    }

    // Calculate duration on the backend
    const duration = Math.floor((now.getTime() - activeSession.startTime.getTime()) / 1000);

    const stoppedSession = await prisma.session.update({
      where: { id: activeSession.id },
      data: {
        isActive: false,
        endTime: now,
        duration,
      },
    });

    return NextResponse.json(stoppedSession);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to stop session' }, { status: 500 });
  }
}
