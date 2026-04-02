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
    { key: "company_name", value: "Akritos" },
    { key: "invoice_prefix", value: "INV" },
    { key: "invoice_next_number", value: "1" },
    { key: "default_currency", value: "USD" },
    { key: "default_due_days", value: "30" },
  ];

  for (const s of settings) {
    await db.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  // Default bookable service — free consultation
  const service = await db.service.upsert({
    where: { slug: "free-consultation" },
    update: {},
    create: {
      name: "Free Consultation",
      slug: "free-consultation",
      description:
        "A no-obligation 30-minute call to assess your technology, identify risks, and give you a clear plan with real numbers.",
      duration: 30,
      bufferAfter: 15,
      price: null,
      isPublic: true,
      isActive: true,
    },
  });

  // Default availability for admin — Mon–Fri 9am–5pm Eastern
  const existingAvail = await db.staffAvailability.count({
    where: { userId: admin.id, serviceId: service.id },
  });
  if (existingAvail === 0) {
    await db.staffAvailability.createMany({
      data: [1, 2, 3, 4, 5].map((dayOfWeek) => ({
        userId: admin.id,
        serviceId: service.id,
        dayOfWeek,
        startTime: "09:00",
        endTime: "17:00",
        timezone: "America/New_York",
      })),
    });
  }

  console.log(`Seeded service: ${service.name} (${service.slug})`);
  console.log(`Seeded admin: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
