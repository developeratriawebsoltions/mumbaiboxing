import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    /*
     * ---------------------------------------------------------
     * 1. Get logged-in user from JWT cookie
     * ---------------------------------------------------------
     */

    const token = req.cookies.get("mba_token")?.value;

    const payload = token
      ? await verifyToken(token)
      : null;

    if (!payload) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * 2. Find boxer
     * ---------------------------------------------------------
     */

    const boxer = await prisma.boxer.findUnique({
      where: {
        userId: payload.id,
      },

      include: {
        /*
         * -----------------------------------------------------
         * User
         * -----------------------------------------------------
         */

        user: {
          include: {
            /*
             * Prisma relation is "document" in your schema.
             */
            document: {
              select: {
                id: true,
                label: true,
                filePath: true,
                fileType: true,
                createdAt: true,
              },
            },
          },

          /*
           * We also need membership information.
           *
           * These are selected separately below because we are
           * using include for the document relation.
           */
        },

        /*
         * -----------------------------------------------------
         * Academy
         * -----------------------------------------------------
         */

        academy: {
          select: {
            name: true,
          },
        },
      },
    });

    /*
     * ---------------------------------------------------------
     * 3. Boxer not found
     * ---------------------------------------------------------
     */

    if (!boxer) {
      return NextResponse.json(
        {
          error: "Boxer not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * 4. Get membership information
     * ---------------------------------------------------------
     */

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },

      select: {
        id: true,
        email: true,
        createdAt: true,

        registrationStatus: true,

        membershipId: true,
        membershipValidFrom: true,
        membershipExpiry: true,
        membershipActivatedAt: true,
      },
    });

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

    /*
     * ---------------------------------------------------------
     * 5. Return dashboard data
     *
     * IMPORTANT:
     * Prisma relation = document
     *
     * Dashboard expects = documents
     *
     * So we convert:
     *
     * user.document
     *       ↓
     * user.documents
     * ---------------------------------------------------------
     */

    return NextResponse.json({
      id: boxer.id,
      name: boxer.name,
      dob: boxer.dob,
      weight: boxer.weight,
      ageGroup: boxer.ageGroup,
      rank: boxer.rank,

      academy: boxer.academy,

      user: {
        email: user.email,
        createdAt: user.createdAt,

        registrationStatus:
          user.registrationStatus,

        /*
         * Real membership information
         */

        membershipId:
          user.membershipId,

        membershipValidFrom:
          user.membershipValidFrom,

        membershipExpiry:
          user.membershipExpiry,

        membershipActivatedAt:
          user.membershipActivatedAt,

        /*
         * Convert Prisma "document" relation
         * to frontend "documents".
         */

        documents: boxer.user.document,
      },
    });
  } catch (error) {
    console.error(
      "Boxer dashboard API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load boxer profile.",
      },
      {
        status: 500,
      }
    );
  }
}