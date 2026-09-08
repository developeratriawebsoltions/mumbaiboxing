import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export const runtime = "nodejs";

/* =========================================================
   GET REFEREE / JUDGE DASHBOARD DATA
   ========================================================= */

export async function GET(req: NextRequest) {
  try {
    /* =======================================================
       AUTHENTICATION
       ======================================================= */

    const token = req.cookies.get("mba_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Authentication required",
        },
        {
          status: 401,
        }
      );
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.id) {
      return NextResponse.json(
        {
          error: "Invalid or expired session",
        },
        {
          status: 401,
        }
      );
    }

    const userId = Number(payload.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid user session",
        },
        {
          status: 401,
        }
      );
    }

    /* =======================================================
       LOAD USER
       ======================================================= */

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        email: true,
        role: true,
        registrationStatus: true,

        membershipId: true,
        membershipValidFrom: true,
        membershipExpiry: true,
        membershipActivatedAt: true,

        refereeJudge: {
          select: {
            id: true,
            userId: true,

            name: true,
            phone: true,
            dob: true,
            gender: true,

            designation: true,
            officiatingLevel: true,
            qualification: true,
            officiatingExperience: true,
            federationAffiliation: true,

            aadhaarPan: true,
            tournamentsOfficiated: true,
            achievements: true,

            address: true,

            membershipExpiry: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        /* ===================================================
           DOCUMENTS
           =================================================== */

        document: {
          select: {
            id: true,
            label: true,
            filePath: true,
            fileType: true,
            status: true,
            rejectionReason: true,
            createdAt: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        },

        /* ===================================================
           NOTIFICATIONS
           =================================================== */

        notifications: {
          select: {
            id: true,
            title: true,
            message: true,
            read: true,
            createdAt: true,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 10,
        },
      },
    });

    /* =======================================================
       USER VALIDATION
       ======================================================= */

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (user.role !== "referee_judge") {
      return NextResponse.json(
        {
          error: "Referee / Judge access required",
        },
        {
          status: 403,
        }
      );
    }

    if (!user.refereeJudge) {
      return NextResponse.json(
        {
          error: "Referee / Judge profile not found",
        },
        {
          status: 404,
        }
      );
    }

    const refereeJudgeId = user.refereeJudge.id;

    /* =======================================================
       PAYMENTS
       ======================================================= */

    const payments = await prisma.payment.findMany({
      where: {
        refereeJudgeId,
      },

      select: {
        id: true,
        type: true,
        amount: true,
        method: true,
        status: true,

        membershipExpiry: true,
        createdAt: true,

        razorpayOrderId: true,
        razorpayPaymentId: true,

        isDeveloperBypass: true,
        invoiceNumber: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    /* =======================================================
       CERTIFICATES
       ======================================================= */

    const certificates = await prisma.certificate.findMany({
      where: {
        refereeJudgeId,
      },

      select: {
        id: true,
        type: true,
        event: true,
        issuedAt: true,
        qrStatus: true,
      },

      orderBy: {
        issuedAt: "desc",
      },
    });

    /* =======================================================
       TOURNAMENT ASSIGNMENTS
       ======================================================= */

    const tournamentAssignments =
      await prisma.referee_judge_tournament.findMany({
        where: {
          refereeJudgeId,
        },

        select: {
          id: true,

          role: true,
          status: true,

          assignedAt: true,
          notes: true,

          tournament: {
            select: {
              id: true,
              name: true,
              location: true,

              startDate: true,
              endDate: true,

              weightClass: true,
              status: true,

              entryFee: true,
              isFeatured: true,

              createdAt: true,
            },
          },
        },

        orderBy: [
          {
            tournament: {
              startDate: "asc",
            },
          },
          {
            assignedAt: "desc",
          },
        ],
      });

    /* =======================================================
       MEMBERSHIP STATUS
       ======================================================= */

    const now = new Date();

    const membershipExpiry = user.membershipExpiry
      ? new Date(user.membershipExpiry)
      : null;

    const membershipActive =
      user.registrationStatus === "ACTIVE" &&
      membershipExpiry !== null &&
      membershipExpiry > now;

    /* =======================================================
       UPCOMING TOURNAMENTS
       ======================================================= */

    const upcomingTournaments = tournamentAssignments.filter(
      (assignment) => {
        const startDate = assignment.tournament.startDate;

        if (!startDate) {
          return false;
        }

        return new Date(startDate) >= now;
      }
    );

    /* =======================================================
       RESPONSE
       ======================================================= */

    return NextResponse.json({
      success: true,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        registrationStatus: user.registrationStatus,
      },

      membership: {
        id: user.membershipId,
        validFrom: user.membershipValidFrom,
        expiry: user.membershipExpiry,
        activatedAt: user.membershipActivatedAt,
        active: membershipActive,
      },

      profile: user.refereeJudge,

      documents: user.document,

      certificates,

      tournamentAssignments,

      upcomingTournaments,

      payments,

      notifications: user.notifications,
    });
  } catch (error) {
    console.error(
      "Referee/Judge dashboard API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load Referee / Judge dashboard",
      },
      {
        status: 500,
      }
    );
  }
}