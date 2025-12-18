import { auth } from "@/lib/auth";

async function setupBetterAuth() {
  try {
    console.log("Setting up Better Auth database tables...");

    // This will create the necessary database tables
    await auth.$database.sync();

    console.log("Better Auth database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up Better Auth:", error);
    process.exit(1);
  }
}

setupBetterAuth();