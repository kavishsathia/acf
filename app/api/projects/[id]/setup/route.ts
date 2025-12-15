import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/getUser';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const workerUrl = process.env.WORKER_URL;
    const workerSecret = process.env.WORKER_API_SECRET;

    if (!workerUrl || !workerSecret) {
      return NextResponse.json(
        { error: 'Worker configuration missing' },
        { status: 500 }
      );
    }

    const response = await fetch(`${workerUrl}/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': workerSecret,
      },
      body: JSON.stringify({ projectId: id }),
    });

    const data = (await response.json()) as {
      projectId?: string;
      previewUrl?: string;
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to setup sandbox' },
        { status: response.status }
      );
    }

    // Save the preview URL to the database
    if (data.previewUrl) {
      await prisma.project.update({
        where: { id },
        data: { previewUrl: data.previewUrl },
      });
    }

    return NextResponse.json({
      projectId: data.projectId,
      previewUrl: data.previewUrl,
      message: data.message,
    });
  } catch (error) {
    console.error('Error setting up sandbox:', error);
    return NextResponse.json(
      { error: 'Failed to setup sandbox' },
      { status: 500 }
    );
  }
}
