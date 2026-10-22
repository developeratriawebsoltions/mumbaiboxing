import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  { email: "superadmin@mba.com", password: "superadmin@123", role: "superadmin" as const, login: "/superadmin/login" },
  { email: "admin@mba.com",      password: "admin@123",      role: "admin"      as const, login: "/admin/login" },
];

async function main() {
  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      console.log(`Already exists: ${u.email}`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.create({
      data: { email: u.email, password: hashed, role: u.role, registrationStatus: "ACTIVE", updatedAt: new Date() },
    });
    console.log(`✅ ${u.role} created: ${u.email} | password: ${u.password} | login: ${u.login}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });