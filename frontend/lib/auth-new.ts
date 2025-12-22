import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Email sending function (you can use Resend, SendGrid, or any email service)
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // TODO: Implement with your email service (Resend recommended)
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'noreply@yourdomain.com', to, subject, html });
  
  console.log(`📧 Email would be sent to ${to}: ${subject}`);
  console.log(html);
}

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Email & Password Authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Require email verification
    minPasswordLength: 8,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>Click the button below to reset your password:</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6B7280;">${url}</p>
            <p>This link will expire in 1 hour.</p>
          </div>
        `,
      });
    },
  },

  // Email Verification
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome! Please verify your email</h2>
            <p>Thanks for signing up! Click the button below to verify your email address:</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Verify Email</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6B7280;">${url}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
        `,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  // Social Providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  trustedOrigins: ["http://localhost:3000"],
  
  // Custom table names
  user: {
    modelName: "better_auth_user",
  },
  session: {
    modelName: "better_auth_session",
    expiresIn: 7 * 24 * 60 * 60, // 7 days
  },
  account: {
    modelName: "better_auth_account",
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  verification: {
    modelName: "better_auth_verification",
  },
  
  // JWT plugin
  plugins: [
    jwt()
  ],
});
