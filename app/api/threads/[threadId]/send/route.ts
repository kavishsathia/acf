import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/getUser';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ threadId: string }>;
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

    const { threadId } = await params;
    const body = (await request.json()) as { content: string };

    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        project: true,
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    if (thread.project.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userMessage = await prisma.message.create({
      data: {
        threadId,
        role: 'user',
        content: body.content.trim(),
      },
    });

    const workerUrl = process.env.WORKER_URL;
    const workerSecret = process.env.WORKER_API_SECRET;

    if (!workerUrl || !workerSecret) {
      return NextResponse.json(
        { error: 'Worker configuration missing' },
        { status: 500 }
      );
    }

    const editResponse = await fetch(`${workerUrl}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': workerSecret,
      },
      body: JSON.stringify({
        projectId: thread.projectId,
        threadId,
        prompt: body.content.trim(),
      }),
    });

    const editData = (await editResponse.json()) as {
      projectId?: string;
      response?: string;
      steps?: number;
      toolCalls?: number;
      error?: string;
      message?: string;
    };

    if (!editResponse.ok) {
      console.error('Edit endpoint error:', editData);
      return NextResponse.json({
        userMessage,
        editError: editData.error || editData.message || 'Edit failed',
      });
    }

    return NextResponse.json({
      userMessage,
      editResponse: editData,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
