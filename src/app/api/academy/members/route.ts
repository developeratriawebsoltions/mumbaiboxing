import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get("mba_token")?.value;

  if (!token) return null;

  return await verifyToken(token);
}

/**
 * GET
 * Returns all boxers and coaches that can be managed
 * by the logged-in academy.
 */
export async function GET(req: NextRequest) {
  try {
    const payload = await getAuthenticatedUser(req);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (payload.role !== "academy") {
      return NextResponse.json(
        { error: "Academy access required." },
        { status: 403 }
      );
    }

    const academy = await prisma.academy.findUnique({
      where: {
        userId: payload.id,
      },
      select: {
        id: true,
      },
    });

    if (!academy) {
      return NextResponse.json(
        { error: "Academy profile not found." },
        { status: 404 }
      );
    }

    const [boxers, coaches] = await Promise.all([
      prisma.boxer.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          gender: true,
          weight: true,
          weightCategory: true,
          ageGroup: true,
          category: true,
          rank: true,
          academyId: true,
          membershipExpiry: true,
          user: {
            select: {
              email: true,
              registrationStatus: true,
              membershipId: true,
            },
          },
        },
      }),

      prisma.coach.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          phone: true,
          academyId: true,
          membershipExpiry: true,
          user: {
            select: {
              email: true,
              registrationStatus: true,
              membershipId: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      academyId: academy.id,

      boxers: boxers.map((boxer) => ({
        ...boxer,
        assigned: boxer.academyId === academy.id,
      })),

      coaches: coaches.map((coach) => ({
        ...coach,
        assigned: coach.academyId === academy.id,
      })),
    });
  } catch (error) {
    console.error("Academy members GET error:", error);

    return NextResponse.json(
      { error: "Failed to load academy members." },
      { status: 500 }
    );
  }
}

/**
 * POST
 * Assign a boxer or coach to the logged-in academy.
 *
 * Body:
 * {
 *   type: "boxer" | "coach",
 *   id: number
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getAuthenticatedUser(req);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (payload.role !== "academy") {
      return NextResponse.json(
        { error: "Academy access required." },
        { status: 403 }
      );
    }

    const academy = await prisma.academy.findUnique({
      where: {
        userId: payload.id,
      },
      select: {
        id: true,
      },
    });

    if (!academy) {
      return NextResponse.json(
        { error: "Academy profile not found." },
        { status: 404 }
      );
    }

    const body = await req.json();

    const type = body?.type;
    const id = Number(body?.id);

    if (!["boxer", "coach"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid member type." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid member ID." },
        { status: 400 }
      );
    }

    if (type === "boxer") {
      const boxer = await prisma.boxer.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          academyId: true,
        },
      });

      if (!boxer) {
        return NextResponse.json(
          { error: "Boxer not found." },
          { status: 404 }
        );
      }

      if (boxer.academyId === academy.id) {
        return NextResponse.json({
          success: true,
          message: "Boxer is already assigned to this academy.",
        });
      }

      await prisma.boxer.update({
        where: {
          id,
        },
        data: {
          academyId: academy.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: `${boxer.name} assigned to academy successfully.`,
      });
    }

    const coach = await prisma.coach.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        academyId: true,
      },
    });

    if (!coach) {
      return NextResponse.json(
        { error: "Coach not found." },
        { status: 404 }
      );
    }

    if (coach.academyId === academy.id) {
      return NextResponse.json({
        success: true,
        message: "Coach is already assigned to this academy.",
      });
    }

    await prisma.coach.update({
      where: {
        id,
      },
      data: {
        academyId: academy.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${coach.name} assigned to academy successfully.`,
    });
  } catch (error) {
    console.error("Academy members POST error:", error);

    return NextResponse.json(
      { error: "Failed to assign member." },
      { status: 500 }
    );
  }
}

/**
 * DELETE
 * Removes a boxer or coach from the logged-in academy.
 *
 * Body:
 * {
 *   type: "boxer" | "coach",
 *   id: number
 * }
 */
export async function DELETE(req: NextRequest) {
  try {
    const payload = await getAuthenticatedUser(req);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (payload.role !== "academy") {
      return NextResponse.json(
        { error: "Academy access required." },
        { status: 403 }
      );
    }

    const academy = await prisma.academy.findUnique({
      where: {
        userId: payload.id,
      },
      select: {
        id: true,
      },
    });

    if (!academy) {
      return NextResponse.json(
        { error: "Academy profile not found." },
        { status: 404 }
      );
    }

    const body = await req.json();

    const type = body?.type;
    const id = Number(body?.id);

    if (!["boxer", "coach"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid member type." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid member ID." },
        { status: 400 }
      );
    }

    if (type === "boxer") {
      const boxer = await prisma.boxer.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          academyId: true,
        },
      });

      if (!boxer) {
        return NextResponse.json(
          { error: "Boxer not found." },
          { status: 404 }
        );
      }

      // Prevent an academy from removing a boxer
      // belonging to another academy.
      if (boxer.academyId !== academy.id) {
        return NextResponse.json(
          {
            error:
              "This boxer is not assigned to your academy.",
          },
          { status: 403 }
        );
      }

      await prisma.boxer.update({
        where: {
          id,
        },
        data: {
          academyId: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: `${boxer.name} removed from academy.`,
      });
    }

    const coach = await prisma.coach.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        academyId: true,
      },
    });

    if (!coach) {
      return NextResponse.json(
        { error: "Coach not found." },
        { status: 404 }
      );
    }

    // Prevent an academy from removing a coach
    // belonging to another academy.
    if (coach.academyId !== academy.id) {
      return NextResponse.json(
        {
          error:
            "This coach is not assigned to your academy.",
        },
        { status: 403 }
      );
    }

    await prisma.coach.update({
      where: {
        id,
      },
      data: {
        academyId: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${coach.name} removed from academy.`,
    });
  } catch (error) {
    console.error("Academy members DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to remove member." },
      { status: 500 }
    );
  }
}