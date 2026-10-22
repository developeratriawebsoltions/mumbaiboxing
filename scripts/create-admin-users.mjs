import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ quiet: true });

const prisma = new PrismaClient();

async function main() {
  const accounts = [
    {
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      role: "superadmin",
    },
    {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    },
  ];

  const missingSettings = accounts
    .filter((account) => !account.email?.trim() || !account.password)
    .map((account) => account.role.toUpperCase());

  if (missingSettings.length > 0) {
    throw new Error(
      `Set the email and password environment variables for: ${missingSettings.join(", ")}.`
    );
  }

  for (const account of accounts) {
    const email = account.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing && existing.role !== account.role) {
      throw new Error(
        `Configured account for role ${account.role} already exists with a different role.`
      );
    }
    if (existing) {
      console.log(`Configured ${account.role} account already exists; no changes made.`);
      continue;
    }

    const hash = await bcrypt.hash(account.password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hash,
        role: account.role,
        registrationStatus: "ACTIVE",
        updatedAt: new Date(),
      },
    });

    console.log(`Created ${account.role} account.`);
  }
}

main()
  .catch((error) => {
    console.error("Unable to create configured admin accounts:", error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
