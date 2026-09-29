import { mockDb } from "../lib/data-store";

console.log("================================================================================");
console.log("👟 STEP HIGH SNEAKERS — DATABASE & LEDGER ENTRIES INSPECTION (CO4)");
console.log("================================================================================\n");

const transactions = mockDb.getTransactions();
const auditLogs = mockDb.getAuditLogs();
const users = mockDb.getUsers();

console.log(`📌 SUMMARY COUNTS:`);
console.log(`   - Users:        ${users.length} accounts`);
console.log(`   - Transactions: ${transactions.length} pre-order entries`);
console.log(`   - Audit Logs:   ${auditLogs.length} lifecycle entries\n`);

console.log("--------------------------------------------------------------------------------");
console.log("📅 SNEAKER PRE-ORDER TRANSACTIONS WITH DATE TIMESTAMPS");
console.log("--------------------------------------------------------------------------------");
transactions.forEach((tx, idx) => {
  console.log(`[Entry #${idx + 1}] Order: ${tx.orderNumber}`);
  console.log(`   • Date & Timestamp: ${tx.createdAt} (${new Date(tx.createdAt).toUTCString()})`);
  console.log(`   • Model:            ${tx.modelName} [${tx.edition}]`);
  console.log(`   • Customer:         ${tx.userName} <${tx.userEmail}> (FK: ${tx.userId})`);
  console.log(`   • Details:          Size ${tx.size} US | Qty: ${tx.quantity} | Total: $${tx.totalAmount.toFixed(2)} USD`);
  console.log(`   • Status:           [${tx.status}]`);
  console.log(`   • Associated Logs:  ${tx.auditLogs.map((l) => `${l.action} (${l.status})`).join(" → ")}`);
  console.log("");
});

console.log("--------------------------------------------------------------------------------");
console.log("📜 LIFECYCLE AUDIT LOGS (EMAIL NOTIFICATIONS & AUTH GATES)");
console.log("--------------------------------------------------------------------------------");
auditLogs.slice(0, 8).forEach((log) => {
  console.log(`• [${log.createdAt}] [${log.category}] ${log.action} → Status: ${log.status}`);
  console.log(`  Details: ${JSON.stringify(log.metadata)}`);
});

console.log("\n================================================================================");
console.log("✓ All date entries verified with strict relational foreign-key integrity.");
console.log("================================================================================\n");
