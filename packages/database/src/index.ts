export interface DatabaseHealth {
  configured: boolean;
  provider: "supabase";
}

export const databaseHealth: DatabaseHealth = {
  configured: false,
  provider: "supabase",
};
