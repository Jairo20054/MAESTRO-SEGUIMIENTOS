import { describe, expect, it } from "vitest";

import { accountBackupEnvelopeSchema } from "./legacy-backup";

describe("accountBackupEnvelopeSchema", () => {
  it("rejects an unsupported backup version", () => {
    const result = accountBackupEnvelopeSchema.safeParse({
      format: "maestro-account-backup",
      version: 2,
      exportedAt: "2026-08-26T12:00:00.000Z",
      schemaVersion: "1",
      sources: [],
      entities: {},
    });

    expect(result.success).toBe(false);
  });
});
