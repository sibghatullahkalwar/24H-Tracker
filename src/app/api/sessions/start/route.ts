import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const MOCK_USER_ID = 'default-user';

const startSchema = z.object({
  sectionId: z.string().min(1, 'Section ID is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sectionId } = startSchema.parse(body);

    const now = new Date();

    // Verify section ownership
    const section = await prisma.section.findFirst({
      where: { id: sectionId, userId: MOCK_USER_ID },
    });

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    // Use a transaction to safely stop any active session and start a new one
    const [stopped, started] = await prisma.$transaction(async (tx) => {
      // 1. Find the currently active session for the user
      const activeSession = await tx.session.findFirst({
        where: { userId: MOCK_USER_ID, isActive: true },
      });

      let stoppedSession = null;
      if (activeSession) {
        // Calculate duration safely on the backend
        const duration = Math.floor((now.getTime() - activeSession.startTime.getTime()) / 1000);
        stoppedSession = await tx.session.update({
          where: { id: activeSession.id },
          data: {
            isActive: false,
            endTime: now,
            duration,
          },
        });
      }

      // 2. Create the new active session
      const newSession = await tx.session.create({
        data: {
          sectionId,
          userId: MOCK_USER_ID,
          startTime: now,
          isActive: true,
        },
      });

      return [stoppedSession, newSession];
    });

    return NextResponse.json({ stopped, started }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
  }
}
