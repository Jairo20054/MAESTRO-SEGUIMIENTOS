import { z } from "zod";

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const legacySourceManifestSchema = z.object({
  sourceKey: z.string().min(1).max(160),
  sourceVersion: z.string().max(40).nullable(),
  fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
  recordCount: z.number().int().nonnegative(),
  firstDate: dateKey.nullable(),
  lastDate: dateKey.nullable(),
});

export const accountBackupEnvelopeSchema = z.object({
  format: z.literal("maestro-account-backup"),
  version: z.literal(1),
  exportedAt: z.iso.datetime(),
  schemaVersion: z.string().min(1).max(40),
  sources: z.array(legacySourceManifestSchema).max(200),
  entities: z.record(z.string(), z.array(z.unknown()).max(50_000)),
});

export type AccountBackupEnvelope = z.infer<typeof accountBackupEnvelopeSchema>;
