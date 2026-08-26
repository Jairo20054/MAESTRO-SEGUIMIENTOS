export type { Database, Json, Tables, TablesInsert, TablesUpdate } from "./database.types";

export interface DatabaseHealth {
  configured: boolean;
  provider: "supabase";
}

export const databaseHealth: DatabaseHealth = {
  configured: true,
  provider: "supabase",
};
