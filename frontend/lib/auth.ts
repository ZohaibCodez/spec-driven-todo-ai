import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Email sending function with Resend
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Todo App <onboarding@resend.dev>", // Use onboarding@resend.dev for testing
      to,
      subject,
      html,
    });
    
    if (error) {
      console.error('❌ Resend error:', error);
      // Fallback to console log for development
      console.log(`📧 Email to ${to}: ${subject}`);
      console.log(html);
    } else {
      console.log(`✅ Email sent successfully to ${to}:`, data);
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    // Log email for development/debugging
    console.log(`📧 Email to ${to}: ${subject}`);
    console.log(html);
  }
}

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Email & Password Authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Set to true when email service is configured
    minPasswordLength: 8,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Reset Your Password 🔒</h1>
              </div>
              <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">Password Reset Request</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  We received a request to reset your password. Click the button below to create a new password.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${url}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                    Reset Password
                  </a>
                </div>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                  Or copy and paste this link into your browser:<br>
                  <a href="${url}" style="color: #667eea; word-break: break-all;">${url}</a>
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
                  If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
              </div>
            </div>
          </body>
          </html>
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
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Todo App! 🎉</h1>
              </div>
              <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">Verify Your Email</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Thank you for signing up! Please verify your email address to get started with your account.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${url}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                    Verify Email Address
                  </a>
                </div>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                  Or copy and paste this link into your browser:<br>
                  <a href="${url}" style="color: #667eea; word-break: break-all;">${url}</a>
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
                  If you didn't create an account, you can safely ignore this email.
                </p>
              </div>
            </div>
          </body>
          </html>
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
    jwt({
      algorithm: "HS256",
      expiresIn: "7d",
    }),
  ],
});
