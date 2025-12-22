'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: '/reset-password',
      });

      if (result.error) {
        addToast(result.error.message || 'Failed to send reset email', 'error');
      } else {
        setEmailSent(true);
        addToast('Password reset email sent!', 'success');
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to send reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/50 dark:to-purple-950/50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              We've sent a password reset link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium mb-2">Didn't receive the email?</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Check your spam folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait a few minutes for the email to arrive</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              variant="secondary"
              onClick={() => setEmailSent(false)}
              className="w-full"
            >
              Try Another Email
            </Button>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/50 dark:to-purple-950/50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold">Forgot Password?</CardTitle>
          <CardDescription className="text-base">
            No worries! Enter your email and we'll send you reset instructions.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                required
                autoComplete="email"
                className={`h-12 bg-white dark:bg-gray-900 border ${
                  error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'
                } focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
              {error && (
                <p id="email-error" className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="w-4 h-4 flex items-center justify-center">⚠</span>
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
              loading={loading}
            >
              Send Reset Link
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col space-y-3">
          <Link href="/login" className="w-full">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
