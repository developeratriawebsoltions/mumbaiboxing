import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get("mba_token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);

  return payload;
}

/*
|--------------------------------------------------------------------------
| GET /api/boxer
|--------------------------------------------------------------------------
| Returns the logged-in boxer's complete read-only dashboard data.
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

    /*
     * Find the boxer and all dashboard-related data.
     */
    const boxer = await prisma.boxer.findUnique({
      where: {
        userId: payload.id,
      },

      include: {
        /*
         * Documents
         */
        user: {
          include: {
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
          },
        },

        /*
         * Academy
         */
        academy: {
          select: {
            name: true,
          },
        },

        /*
         * Medical
         */
        medical: {
          select: {
            id: true,
            fitnessStatus: true,
            expiryDate: true,
            injury: true,
            eligible: true,
            updatedAt: true,
            createdAt: true,
          },
        },

        /*
         * Certificates
         */
        certificate: {
          orderBy: {
            issuedAt: "desc",
          },

          select: {
            id: true,
            type: true,
            event: true,
            issuedAt: true,
            qrStatus: true,
          },
        },

        /*
         * Tournament Entries
         */
        tournamententry: {
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            createdAt: true,

            tournament: {
              select: {
                id: true,
                name: true,
                location: true,
                startDate: true,
                endDate: true,
                weightClass: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!boxer) {
      return NextResponse.json(
        { error: "Boxer not found" },
        { status: 404 }
      );
    }

    /*
     * Get account + membership information.
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
        { error: "User not found" },
        { status: 404 }
      );
    }

    /*
     * Return clean dashboard response.
     */
    return NextResponse.json({
      /*
       * --------------------------------------------------------
       * Boxer
       * --------------------------------------------------------
       */
      id: boxer.id,

      name: boxer.name,
      dob: boxer.dob,
      gender: boxer.gender,
      phone: boxer.phone,
      address: boxer.address,
      city: boxer.city,
      state: boxer.state,
      pincode: boxer.pincode,
      photo: boxer.photo,

      /*
       * --------------------------------------------------------
       * Boxing information
       * --------------------------------------------------------
       */
      category: boxer.category,
      weight: boxer.weight,
      weightCategory: boxer.weightCategory,
      ageGroup: boxer.ageGroup,
      rank: boxer.rank,

      /*
       * --------------------------------------------------------
       * Academy
       * --------------------------------------------------------
       */
      academy: boxer.academy,

      /*
       * --------------------------------------------------------
       * Medical
       * --------------------------------------------------------
       */
      medical: boxer.medical,

      /*
       * --------------------------------------------------------
       * Account + Membership
       * --------------------------------------------------------
       */
      user: {
        email: user.email,
        createdAt: user.createdAt,

        registrationStatus:
          user.registrationStatus,

        membershipId:
          user.membershipId,

        membershipValidFrom:
          user.membershipValidFrom,

        membershipExpiry:
          user.membershipExpiry,

        membershipActivatedAt:
          user.membershipActivatedAt,

        /*
         * Prisma relation is "document".
         * Frontend uses "documents".
         */
        documents: boxer.user.document,
      },

      /*
       * --------------------------------------------------------
       * Certificates
       * --------------------------------------------------------
       */
      certificates: boxer.certificate,

      /*
       * --------------------------------------------------------
       * Tournament Entries
       * --------------------------------------------------------
       */
      tournamentEntries:
        boxer.tournamententry,
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