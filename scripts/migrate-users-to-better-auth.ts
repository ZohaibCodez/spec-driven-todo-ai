import { Pool } from 'pg';

// This script migrates existing users from the custom user table to Better Auth format
async function migrateUsers() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Starting user migration to Better Auth format...');

    // Get existing users from the custom table (assuming it's named 'user' based on earlier findings)
    const { rows: existingUsers } = await pool.query(
      'SELECT id, email, password, name, created_at, updated_at FROM "user"'
    );

    console.log(`Found ${existingUsers.length} existing users to migrate`);

    for (const user of existingUsers) {
      // Insert into Better Auth user table (the table names may vary based on Better Auth version)
      try {
        await pool.query(`
          INSERT INTO "better_auth_user" (id, email, email_verified, name, image, created_at, updated_at)
          VALUES ($1, $2, true, $3, NULL, $4, $5)
          ON CONFLICT (email) DO NOTHING
        `, [user.id, user.email, user.name || user.email.split('@')[0], user.created_at, user.updated_at]);

        // Insert password into account table
        await pool.query(`
          INSERT INTO "better_auth_account" (id, user_id, provider_id, provider_account_id, password, created_at, updated_at)
          VALUES ($1, $2, 'credential', $2, $3, $4, $5)
          ON CONFLICT (provider_id, provider_account_id) DO NOTHING
        `, [user.id, user.id, user.password, user.created_at, user.updated_at]);

        console.log(`Migrated user: ${user.email}`);
      } catch (insertError) {
        console.error(`Error migrating user ${user.email}:`, insertError);
      }
    }

    console.log('User migration completed');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await pool.end();
  }
}

// Only run if called directly (not imported)
if (require.main === module) {
  migrateUsers().catch(console.error);
}