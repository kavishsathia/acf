import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/getUser';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
        violationCount: true,
        contractCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { name: string; description: string; thumbnail?: string };
    const { name, description, thumbnail } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        thumbnail: thumbnail || null,
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
        violationCount: true,
        contractCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: 'Project created successfully', project },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
