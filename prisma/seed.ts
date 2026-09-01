import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@mba.com";
  const password = "superadmin@123";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Superadmin already exists:", email);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashed, role: "superadmin" },
  });

  console.log("✅ Superadmin created:");
  console.log("   Email   :", email);
  console.log("   Password:", password);
  console.log("   Login at: /admin/login");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
