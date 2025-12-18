import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

// Use the same database connection as your backend with Neon-compatible settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon connections
  },
  // Additional settings for Neon compatibility
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20, // Maximum number of clients in the pool
});

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: pool,  // Use the Pool instance directly, not a config object
  // Use custom table names to avoid conflicts with existing tables
  user: {
    modelName: "better_auth_user",  // Use a unique table name
  },
  session: {
    modelName: "better_auth_session",  // Use a unique table name
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    generateId: {
      length: 32,
    },
  },
  account: {
    modelName: "better_auth_account",  // Use a unique table name
    accountModel: {
      fields: {
        // Map to your existing user fields if needed
      }
    }
  },
  verification: {
    modelName: "better_auth_verification",  // Use a unique table name
  },
  // Keep the same JWT settings as your current system
  plugins: [
    jwt({
      algorithm: "HS256",
      expiresIn: "7d", // Same as your current 7-day expiration
    })
  ],
});