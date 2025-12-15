import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface MessagePayload {
  role: 'assistant' | 'tool_call' | 'tool_result';
  content?: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: unknown;
  usage?: Record<string, unknown>;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const apiSecret = request.headers.get('x-api-secret');

    if (!apiSecret || apiSecret !== process.env.WORKER_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { threadId } = await params;
    const body = (await request.json()) as { messages: MessagePayload[] };

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    const messages = await prisma.message.createMany({
      data: body.messages.map((msg) => ({
        threadId,
        role: msg.role,
        content: msg.content ?? null,
        toolName: msg.toolName ?? null,
        toolArgs: msg.toolArgs ? (msg.toolArgs as Prisma.InputJsonValue) : Prisma.JsonNull,
        toolResult: msg.toolResult ? (msg.toolResult as Prisma.InputJsonValue) : Prisma.JsonNull,
        usage: msg.usage ? (msg.usage as Prisma.InputJsonValue) : Prisma.JsonNull,
      })),
    });

    return NextResponse.json({ count: messages.count }, { status: 201 });
  } catch (error) {
    console.error('Error creating messages:', error);
    return NextResponse.json(
      { error: 'Failed to create messages' },
      { status: 500 }
    );
  }
}
