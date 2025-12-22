-- Better Auth Database Tables Check
-- Run this in your PostgreSQL client to verify all tables exist

-- Check if Better Auth tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('better_auth_user', 'better_auth_session', 'better_auth_account', 'better_auth_verification')
        THEN '✅ Required'
        ELSE '⚠️  Optional'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name LIKE 'better_auth_%'
ORDER BY table_name;

-- Check user table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'better_auth_user'
ORDER BY ordinal_position;

-- Count existing users
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users,
    COUNT(CASE WHEN email_verified = false THEN 1 END) as unverified_users
FROM better_auth_user;

-- Check accounts (OAuth connections)
SELECT 
    provider,
    COUNT(*) as accounts
FROM better_auth_account
GROUP BY provider;

-- Recent activity
SELECT 
    u.email,
    u.email_verified,
    u.created_at,
    (SELECT COUNT(*) FROM better_auth_account WHERE user_id = u.id) as linked_accounts
FROM better_auth_user u
ORDER BY u.created_at DESC
LIMIT 10;
