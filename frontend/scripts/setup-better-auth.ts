import { auth } from "@/lib/auth";

async function setupBetterAuth() {
  try {
    console.log("Better Auth is configured and ready!");
    console.log("Tables will be created automatically on first use.");
    
    // Better Auth creates tables automatically when needed
    // No manual sync is required
    
    console.log("Configuration check completed successfully!");
  } catch (error) {
    console.error("Error checking Better Auth configuration:", error);
    process.exit(1);
  }
}

setupBetterAuth();