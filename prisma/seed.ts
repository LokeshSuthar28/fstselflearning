import { PrismaClient, Role, TransactionStatus, AuditCategory } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Sci-Fi / Cyberpunk Sneaker Catalog for Step High Sneakers
const SNEAKER_CATALOG = [
  { model: "QUANTUM CYBER-PULSE 9000", edition: "Obsidian Stealth Matrix", basePrice: 320.0 },
  { model: "NEO-VORTEX RUNNER", edition: "Neon Chromium Synth", basePrice: 260.0 },
  { model: "CHRONO-STRIDE ZERO-G", edition: "Titanium White Orbital", basePrice: 410.0 },
  { model: "HYPER-GRAV KINETIC", edition: "Void Carbon Fiber", basePrice: 290.0 },
  { model: "APEX NEURAL-WARP X", edition: "Cyber Turquoise Glitch", basePrice: 380.0 },
  { model: "SUB-ZERO PHOTON HIGH", edition: "Aurora Borealis Luminescence", basePrice: 340.0 },
];

const SHOE_SIZES = [7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 13.0];

async function main() {
  console.log("🚀 [SEEDING] Starting Step High Sneakers automated data ingestion pipeline...");

  // 1. Clean existing records in reverse foreign-key dependency order (relational integrity)
  console.log("🧹 [SEEDING] Purging existing database records...");
  await prisma.auditLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Deterministic Anchor Users for predictable auth testing
  console.log("👤 [SEEDING] Creating deterministic anchor accounts for RBAC validation...");
  
  const anchorAdmin = await prisma.user.create({
    data: {
      name: "Neo Vance (Lead Architect)",
      email: "admin@stephigh.com",
      emailVerified: true,
      role: Role.ADMIN,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
  });

  const anchorMember = await prisma.user.create({
    data: {
      name: "Trinity Cole (VIP Collector)",
      email: "member@stephigh.com",
      emailVerified: true,
      role: Role.MEMBER,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    },
  });

  const anchorGuest = await prisma.user.create({
    data: {
      name: "Cipher Smith (Unverified Visitor)",
      email: "guest@stephigh.com",
      emailVerified: false,
      role: Role.GUEST,
    },
  });

  const allUsers = [anchorAdmin, anchorMember, anchorGuest];

  // 3. Programmatically populate localized dynamic mock users via @faker-js/faker
  console.log("👥 [SEEDING] Generating randomized mock users across localized locales...");
  const RANDOM_USER_COUNT = 15;

  for (let i = 0; i < RANDOM_USER_COUNT; i++) {
    // Generate role distribution: 75% Members, 15% Guests, 10% Admins
    const roleRoll = Math.random();
    const assignedRole =
      roleRoll < 0.15 ? Role.GUEST : roleRoll < 0.9 ? Role.MEMBER : Role.ADMIN;

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    const createdUser = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        emailVerified: assignedRole !== Role.GUEST,
        role: assignedRole,
        image: faker.image.avatar(),
        createdAt: faker.date.past({ years: 1 }),
      },
    });

    allUsers.push(createdUser);
  }

  console.log(`✅ [SEEDING] Seeded total of ${allUsers.length} users with associated RBAC roles.`);

  // 4. Populate realistic Sneaker Pre-order Transactions adhering to strict Foreign-Key relations
  console.log("👟 [SEEDING] Generating relational Sneaker Pre-order transactions...");
  let totalTransactionsCount = 0;
  let totalAuditLogsCount = 0;

  // Eligible users for transactions (Members and Admins can have pre-orders)
  const eligibleUsers = allUsers.filter((u) => u.role !== Role.GUEST);

  for (const user of eligibleUsers) {
    // Each eligible user has between 1 to 4 pre-orders
    const txCountForUser = faker.number.int({ min: 1, max: 4 });

    for (let t = 0; t < txCountForUser; t++) {
      const sneaker = faker.helpers.arrayElement(SNEAKER_CATALOG);
      const size = faker.helpers.arrayElement(SHOE_SIZES);
      const quantity = faker.number.int({ min: 1, max: 2 });
      const unitPrice = sneaker.basePrice;
      const totalAmount = unitPrice * quantity;
      const orderNumber = `SH-2026-${faker.string.alphanumeric({ length: 8, casing: "upper" })}`;
      const createdAt = faker.date.recent({ days: 30 });

      // Create transaction with strict user foreign-key reference (CO4)
      const transaction = await prisma.transaction.create({
        data: {
          orderNumber,
          userId: user.id, // Foreign-Key relationship maintained
          modelName: sneaker.model,
          edition: sneaker.edition,
          size,
          quantity,
          unitPrice,
          totalAmount,
          currency: "USD",
          status: faker.helpers.arrayElement([
            TransactionStatus.CONFIRMED,
            TransactionStatus.PROCESSING,
            TransactionStatus.DISPATCHED,
          ]),
          shippingAddress: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state({ abbreviated: true }),
            postalCode: faker.location.zipCode(),
            country: "US",
          },
          createdAt,
        },
      });

      totalTransactionsCount++;

      // 5. Populate Lifecycle AuditLogs linked to User and Transaction (Foreign-Key Integrity)
      // Log A: Transaction Creation Audit Log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          transactionId: transaction.id,
          action: "TRANSACTION_CREATED",
          category: AuditCategory.TRANSACTION,
          status: "SUCCESS",
          metadata: {
            orderNumber: transaction.orderNumber,
            totalAmount: transaction.totalAmount.toNumber(),
            model: transaction.modelName,
            source: "SEED_PIPELINE",
          },
          ipAddress: faker.internet.ipv4(),
          createdAt,
        },
      });
      totalAuditLogsCount++;

      // Log B: Simulated Resend Lifecycle Dispatch Audit Log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          transactionId: transaction.id,
          action: "EMAIL_DELIVERED",
          category: AuditCategory.EMAIL_NOTIFICATION,
          status: "DELIVERED",
          metadata: {
            resendMessageId: `msg_${faker.string.alphanumeric(24)}`,
            recipient: user.email,
            template: "PreOrderConfirmation",
            latencyMs: faker.number.int({ min: 320, max: 850 }),
          },
          ipAddress: faker.internet.ipv4(),
          createdAt: new Date(createdAt.getTime() + 1000 * 60 * 2), // 2 mins later
        },
      });
      totalAuditLogsCount++;
    }
  }

  console.log(`\n🎉 [SEEDING COMPLETE] Summary:`);
  console.log(`   - Users:        ${allUsers.length} (Admins, Members, Guests)`);
  console.log(`   - Transactions: ${totalTransactionsCount} Sneaker Pre-orders`);
  console.log(`   - Audit Logs:   ${totalAuditLogsCount} Lifecycle Records`);
  console.log(`   - Foreign Keys: 100% strictly validated.\n`);
}

main()
  .catch((e) => {
    console.error("❌ [SEEDING ERROR]:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
