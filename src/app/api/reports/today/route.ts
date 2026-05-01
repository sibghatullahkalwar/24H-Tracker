import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const MOCK_USER_ID = 'default-user';

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: MOCK_USER_ID }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const timeZone = user.timezone;
    
    // Get the start of the current day in the user's timezone
    const zonedNow = toZonedTime(now, timeZone);
    const startOfTodayZoned = startOfDay(zonedNow);
    
    // The Date object that represents the start of the day in UTC for querying
    // Note: Prisma stores UTC dates. startOfTodayZoned is technically an offset Date, 
    // we need to make sure we query sessions where startTime >= startOfTodayZoned
    
    // 1. Group by sectionId to sum completed durations
    const completedSessionsAgg = await prisma.session.groupBy({
      by: ['sectionId'],
      where: {
        userId: MOCK_USER_ID,
        startTime: {
          gte: startOfTodayZoned,
        },
        isActive: false, // only completed ones
      },
      _sum: {
        duration: true,
      },
    });

    // 2. Find the active session (if any) and calculate its running duration
    const activeSession = await prisma.session.findFirst({
      where: {
        userId: MOCK_USER_ID,
        isActive: true,
        // Even if active session started before today, we might want to count it towards today
        // but for simplicity, let's just include whatever is active
      },
    });

    // Map section IDs to their names
    const sections = await prisma.section.findMany({
      where: { userId: MOCK_USER_ID }
    });
    
    const sectionMap = new Map(sections.map(s => [s.id, s.name]));

    // Combine data
    const timePerSection: Record<string, { name: string, duration: number }> = {};
    
    // Add completed durations
    for (const agg of completedSessionsAgg) {
      const duration = agg._sum.duration || 0;
      timePerSection[agg.sectionId] = {
        name: sectionMap.get(agg.sectionId) || 'Unknown',
        duration
      };
    }

    // Add active duration
    if (activeSession) {
      const activeDuration = Math.floor((now.getTime() - activeSession.startTime.getTime()) / 1000);
      if (timePerSection[activeSession.sectionId]) {
        timePerSection[activeSession.sectionId].duration += activeDuration;
      } else {
        timePerSection[activeSession.sectionId] = {
          name: sectionMap.get(activeSession.sectionId) || 'Unknown',
          duration: activeDuration
        };
      }
    }

    // Calculate total
    const totalTrackedTime = Object.values(timePerSection).reduce((sum, s) => sum + s.duration, 0);

    // Format for charts (array format)
    const breakdown = Object.entries(timePerSection).map(([id, data]) => ({
      sectionId: id,
      name: data.name,
      duration: data.duration
    }));

    return NextResponse.json({
      totalTrackedTime,
      breakdown
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
