import { faker } from "@faker-js/faker";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER" | "GUEST";
  createdAt: string;
}

export interface MockTransaction {
  id: string;
  orderNumber: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  modelName: string;
  edition: string;
  size: number;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  status: "CONFIRMED" | "PROCESSING" | "DISPATCHED" | "PENDING";
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  auditLogs: MockAuditLog[];
}

export interface MockAuditLog {
  id: string;
  userId?: string;
  transactionId?: string;
  action: string;
  category: "TRANSACTION" | "EMAIL_NOTIFICATION" | "AUTH_GATE" | "SYSTEM";
  status: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// Global in-memory storage for instant testing without requiring an active PostgreSQL daemon
const globalStore = globalThis as unknown as {
  mockUsers?: MockUser[];
  mockTransactions?: MockTransaction[];
  mockAuditLogs?: MockAuditLog[];
};

if (!globalStore.mockUsers) {
  // Deterministic Anchor Users
  const neoAdmin: MockUser = {
    id: "usr_neo_admin_01",
    name: "Neo Vance (Lead Architect)",
    email: "admin@stephigh.com",
    role: "ADMIN",
    createdAt: "2026-08-15T09:00:00.000Z",
  };

  const trinityMember: MockUser = {
    id: "usr_trinity_vip_02",
    name: "Trinity Cole (VIP Collector)",
    email: "member@stephigh.com",
    role: "MEMBER",
    createdAt: "2026-09-01T12:30:00.000Z",
  };

  const cipherGuest: MockUser = {
    id: "usr_cipher_guest_03",
    name: "Cipher Smith (Unverified Visitor)",
    email: "guest@stephigh.com",
    role: "GUEST",
    createdAt: "2026-09-20T18:45:00.000Z",
  };

  const users: MockUser[] = [neoAdmin, trinityMember, cipherGuest];

  // Additional mock members
  for (let i = 1; i <= 5; i++) {
    users.push({
      id: `usr_member_${i}`,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      role: "MEMBER",
      createdAt: faker.date.recent({ days: 60 }).toISOString(),
    });
  }

  // Pre-configured realistic Sneaker Transactions with accurate date timestamps
  const transactions: MockTransaction[] = [
    {
      id: "tx_sh_9001",
      orderNumber: "SH-2026-NX8912",
      userId: trinityMember.id,
      userName: trinityMember.name,
      userEmail: trinityMember.email,
      modelName: "QUANTUM CYBER-PULSE 9000",
      edition: "Obsidian Stealth Matrix",
      size: 10.5,
      quantity: 1,
      unitPrice: 320.0,
      totalAmount: 320.0,
      currency: "USD",
      status: "CONFIRMED",
      createdAt: "2026-09-27T10:15:30.000Z",
      shippingAddress: {
        street: "777 Neon Boulevard, Sector 9",
        city: "Neo Kyoto",
        state: "NK",
        postalCode: "94016",
        country: "US",
      },
      auditLogs: [
        {
          id: "aud_01",
          userId: trinityMember.id,
          transactionId: "tx_sh_9001",
          action: "TRANSACTION_CREATED",
          category: "TRANSACTION",
          status: "SUCCESS",
          metadata: { orderNumber: "SH-2026-NX8912", totalAmount: 320.0 },
          createdAt: "2026-09-27T10:15:31.000Z",
        },
        {
          id: "aud_02",
          userId: trinityMember.id,
          transactionId: "tx_sh_9001",
          action: "EMAIL_DELIVERED",
          category: "EMAIL_NOTIFICATION",
          status: "DELIVERED",
          metadata: { resendMessageId: "msg_resend_99182", recipient: trinityMember.email },
          createdAt: "2026-09-27T10:17:10.000Z",
        },
      ],
    },
    {
      id: "tx_sh_9002",
      orderNumber: "SH-2026-VX4421",
      userId: trinityMember.id,
      userName: trinityMember.name,
      userEmail: trinityMember.email,
      modelName: "NEO-VORTEX RUNNER",
      edition: "Neon Chromium Synth",
      size: 11.0,
      quantity: 2,
      unitPrice: 260.0,
      totalAmount: 520.0,
      currency: "USD",
      status: "PROCESSING",
      createdAt: "2026-09-25T14:40:00.000Z",
      shippingAddress: {
        street: "777 Neon Boulevard, Sector 9",
        city: "Neo Kyoto",
        state: "NK",
        postalCode: "94016",
        country: "US",
      },
      auditLogs: [
        {
          id: "aud_03",
          userId: trinityMember.id,
          transactionId: "tx_sh_9002",
          action: "TRANSACTION_CREATED",
          category: "TRANSACTION",
          status: "SUCCESS",
          metadata: { orderNumber: "SH-2026-VX4421", totalAmount: 520.0 },
          createdAt: "2026-09-25T14:40:01.000Z",
        },
      ],
    },
    {
      id: "tx_sh_9003",
      orderNumber: "SH-2026-CS1089",
      userId: neoAdmin.id,
      userName: neoAdmin.name,
      userEmail: neoAdmin.email,
      modelName: "CHRONO-STRIDE ZERO-G",
      edition: "Titanium White Orbital",
      size: 9.5,
      quantity: 1,
      unitPrice: 410.0,
      totalAmount: 410.0,
      currency: "USD",
      status: "DISPATCHED",
      createdAt: "2026-09-22T08:12:15.000Z",
      shippingAddress: {
        street: "101 Cyberway Plaza",
        city: "San Francisco",
        state: "CA",
        postalCode: "94105",
        country: "US",
      },
      auditLogs: [
        {
          id: "aud_04",
          userId: neoAdmin.id,
          transactionId: "tx_sh_9003",
          action: "TRANSACTION_CREATED",
          category: "TRANSACTION",
          status: "SUCCESS",
          metadata: { orderNumber: "SH-2026-CS1089", totalAmount: 410.0 },
          createdAt: "2026-09-22T08:12:16.000Z",
        },
        {
          id: "aud_05",
          userId: neoAdmin.id,
          transactionId: "tx_sh_9003",
          action: "EMAIL_DELIVERED",
          category: "EMAIL_NOTIFICATION",
          status: "DELIVERED",
          metadata: { resendMessageId: "msg_resend_33891", recipient: neoAdmin.email },
          createdAt: "2026-09-22T08:14:02.000Z",
        },
      ],
    },
    {
      id: "tx_sh_9004",
      orderNumber: "SH-2026-HG7712",
      userId: users[3].id,
      userName: users[3].name,
      userEmail: users[3].email,
      modelName: "HYPER-GRAV KINETIC",
      edition: "Void Carbon Fiber",
      size: 10.0,
      quantity: 1,
      unitPrice: 290.0,
      totalAmount: 290.0,
      currency: "USD",
      status: "CONFIRMED",
      createdAt: "2026-09-26T16:20:00.000Z",
      shippingAddress: {
        street: "500 Horizon Drive",
        city: "Austin",
        state: "TX",
        postalCode: "78701",
        country: "US",
      },
      auditLogs: [
        {
          id: "aud_06",
          userId: users[3].id,
          transactionId: "tx_sh_9004",
          action: "TRANSACTION_CREATED",
          category: "TRANSACTION",
          status: "SUCCESS",
          metadata: { orderNumber: "SH-2026-HG7712", totalAmount: 290.0 },
          createdAt: "2026-09-26T16:20:01.000Z",
        },
        {
          id: "aud_07",
          userId: users[3].id,
          transactionId: "tx_sh_9004",
          action: "EMAIL_BOUNCED",
          category: "EMAIL_NOTIFICATION",
          status: "BOUNCED",
          metadata: { resendMessageId: "msg_resend_77812", bounceReason: "Mailbox quota exceeded" },
          createdAt: "2026-09-26T16:22:15.000Z",
        },
      ],
    },
  ];

  const auditLogs = transactions.flatMap((t) => t.auditLogs);

  globalStore.mockUsers = users;
  globalStore.mockTransactions = transactions;
  globalStore.mockAuditLogs = auditLogs;
}

export const mockDb = {
  getUsers: () => globalStore.mockUsers ?? [],
  getTransactions: () => globalStore.mockTransactions ?? [],
  getAuditLogs: () => globalStore.mockAuditLogs ?? [],
  addTransaction: (tx: MockTransaction) => {
    if (!globalStore.mockTransactions) globalStore.mockTransactions = [];
    globalStore.mockTransactions.unshift(tx);
    if (!globalStore.mockAuditLogs) globalStore.mockAuditLogs = [];
    globalStore.mockAuditLogs.unshift(...tx.auditLogs);
    return tx;
  },
  addAuditLog: (log: MockAuditLog) => {
    if (!globalStore.mockAuditLogs) globalStore.mockAuditLogs = [];
    globalStore.mockAuditLogs.unshift(log);
    return log;
  },
};
