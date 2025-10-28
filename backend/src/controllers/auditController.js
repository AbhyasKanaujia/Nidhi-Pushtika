// Temporary stub for createAuditEntry - does not create audit entries yet
const createAuditEntry = async (transactionId, action, userId, before, after) => {
  // Future implementation: save audit entry to DB
  // Currently no-op
  return;
};

module.exports = {
  createAuditEntry
};
