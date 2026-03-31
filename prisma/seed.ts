// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  // Admin user — change password before deploying.
  const passwordHash = await bcrypt.hash("changeme123", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  // Default settings
  const settings = [
    { key: "company_name", value: "My Consultancy" },
    { key: "invoice_prefix", value: "INV" },
    { key: "invoice_next_number", value: "1" },
    { key: "default_currency", value: "USD" },
    { key: "default_due_days", value: "30" },
  ];

  for (const s of settings) {
    await db.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log(`Seeded admin: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
