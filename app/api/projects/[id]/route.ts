import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/getUser';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(
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

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      thumbnail?: string;
      violationCount?: number;
      contractCount?: number;
    };
    const { name, description, thumbnail, violationCount, contractCount } = body;

    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (violationCount !== undefined) updateData.violationCount = violationCount;
    if (contractCount !== undefined) updateData.contractCount = contractCount;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
