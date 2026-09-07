const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = "ChangeMe@123";

  const hash = await bcrypt.hash(password, 10);

  const accounts = [
    {
      email: "superadmin@mba.com",
      role: "superadmin",
    },
    {
      email: "mbaadmin@mba.com",
      role: "admin",
    },
  ];

  for (const account of accounts) {
    const existing = await prisma.user.findUnique({
      where: {
        email: account.email,
      },
    });

    if (existing) {
      console.log(
        `${account.email} already exists. Skipping.`
      );
      continue;
    }

    const user = await prisma.user.create({
  data: {
    email: account.email,
    password: hash,
    role: account.role,
    registrationStatus: "ACTIVE",
    updatedAt: new Date(),
  },
});

    console.log(
      `Created ${account.role}: ${user.email} (ID ${user.id})`
    );
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());