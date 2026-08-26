import type { PendingSyncOperation } from "@maestro/types";

export function deduplicateOperations(
  operations: readonly PendingSyncOperation[],
): PendingSyncOperation[] {
  return [...new Map(operations.map((operation) => [operation.operationId, operation])).values()];
}
