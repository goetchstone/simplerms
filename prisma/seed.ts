// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

const db = new PrismaClient();

// Generate a strong password — 24 chars, alphanumeric + safe punctuation.
// Avoids ambiguous chars (0/O/I/l) so it transcribes cleanly.
function generateAdminPassword(): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 24; i++) {
    password += charset[randomInt(0, charset.length)];
  }
  return password;
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@akritos.com";
  const existing = await db.user.findUnique({ where: { email: adminEmail } });

  // Idempotent: only seed admin if no admin exists. Never overwrite a real password.
  if (!existing) {
    const explicitPassword = process.env.SEED_ADMIN_PASSWORD;
    const password = explicitPassword ?? generateAdminPassword();
    const passwordHash = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        email: adminEmail,
        name: "Admin",
        passwordHash,
        role: "ADMIN",
      },
    });

    if (!explicitPassword) {
      // Generated password — print on stdout with parseable markers so deploy.sh
      // can extract and write to a host-side credentials file (the migrator container
      // is ephemeral, so the file would be lost if written inside).
      console.log("AKRITOS_FIRST_ADMIN_BEGIN");
      console.log(`email=${adminEmail}`);
      console.log(`password=${password}`);
      console.log("AKRITOS_FIRST_ADMIN_END");
    } else {
      console.log(`Admin created with explicit SEED_ADMIN_PASSWORD: ${adminEmail}`);
    }
  } else {
    console.log(`Admin exists, skipping: ${existing.email}`);
  }

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
  const adminUser = await db.user.findUnique({ where: { email: adminEmail } });
  if (adminUser) {
    const existingAvail = await db.staffAvailability.count({
      where: { userId: adminUser.id, serviceId: service.id },
    });
    if (existingAvail === 0) {
      await db.staffAvailability.createMany({
        data: [1, 2, 3, 4, 5].map((dayOfWeek) => ({
          userId: adminUser.id,
          serviceId: service.id,
          dayOfWeek,
          startTime: "09:00",
          endTime: "17:00",
          timezone: "America/New_York",
        })),
      });
    }
  }

  console.log(`Seeded service: ${service.name} (${service.slug})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
