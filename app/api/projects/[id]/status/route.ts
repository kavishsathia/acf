import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        previewUrl: true,
      },
    });

    console.log(project);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // If no cached URL, return inactive
    if (!project.previewUrl) {
      return NextResponse.json({
        active: false,
        reason: "No preview URL cached",
      });
    }

    // Check with worker if sandbox is still active
    const workerUrl = process.env.WORKER_URL;
    const workerSecret = process.env.WORKER_API_SECRET;

    if (!workerUrl || !workerSecret) {
      return NextResponse.json(
        { error: "Worker configuration missing" },
        { status: 500 }
      );
    }

    const response = await fetch(`${workerUrl}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": workerSecret,
      },
      body: JSON.stringify({ projectId: id }),
    });

    const data = (await response.json()) as {
      projectId?: string;
      active?: boolean;
    };

    console.log("Status response data:", data);

    if (data.active) {
      // Sandbox is active, return cached previewUrl from database
      return NextResponse.json({
        active: true,
        previewUrl: project.previewUrl,
      });
    }

    // Sandbox not active, clear cached URL
    await prisma.project.update({
      where: { id },
      data: { previewUrl: null },
    });

    return NextResponse.json({
      active: false,
    });
  } catch (error) {
    console.error("Error checking status:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
