import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For demo purposes, we'll create a mock database connection
// In production, you would use a real database URL
const databaseUrl = process.env.DATABASE_URL || "postgresql://demo:demo@localhost:5432/demo";

let pool: Pool | null = null;
let db: any = null;

try {
  pool = new Pool({ connectionString: databaseUrl });
  db = drizzle({ client: pool, schema });
  console.log("Database connection initialized");
} catch (error) {
  console.warn("Database connection failed, using mock data:", error);
  // Create a mock db object for demo purposes
  pool = null;
  db = {
    select: () => ({ from: () => ({ limit: () => [] }) }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
    delete: () => ({ where: () => [] }),
  };
}

export { pool, db };