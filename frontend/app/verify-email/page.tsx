'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error' | 'pending'>('pending');
  const [message, setMessage] = React.useState('');
  const token = searchParams.get('token');

  const verifyEmail = React.useCallback(async (verificationToken: string) => {
    setStatus('loading');
    try {
      const response = await fetch(`/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Your email has been verified successfully! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/app');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to verify email. The link may be expired or invalid.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while verifying your email. Please try again.');
    }
  }, [router]);

  React.useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/50 dark:to-purple-950/50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            </div>
          )}
          {status === 'success' && (
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          )}
          {status === 'pending' && (
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          )}
          
          <CardTitle className="text-3xl font-bold">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
            {status === 'pending' && 'Check Your Email'}
          </CardTitle>
          
          <CardDescription className="text-base">
            {status === 'loading' && 'Please wait while we verify your email address.'}
            {status === 'success' && message}
            {status === 'error' && message}
            {status === 'pending' && 'We sent you a verification link. Please check your inbox.'}
          </CardDescription>
        </CardHeader>

        {(status === 'error' || status === 'pending') && (
          <CardContent className="space-y-4">
            {status === 'error' && (
              <Button
                onClick={() => router.push('/signup')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                Back to Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            {status === 'pending' && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium mb-2">Didn't receive the email?</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Check your spam folder</li>
                    <li>Make sure the email address is correct</li>
                    <li>Wait a few minutes for the email to arrive</li>
                  </ul>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => router.push('/login')}
                  className="w-full"
                  size="lg"
                >
                  Back to Login
                </Button>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
