import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const MOCK_USER_ID = 'default-user'; // Simple auth mock

const sectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = sectionSchema.parse(body);

    const section = await prisma.section.create({
      data: {
        name,
        userId: MOCK_USER_ID,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}
