'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { signIn } from '@/lib/auth-client';
import { useToast } from '@/components/ui/Toast';
import { ArrowRight, Mail, Lock, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        addToast(result.error.message || 'Failed to sign in', 'error');
      } else {
        addToast('Welcome back!', 'success');
        router.push('/app');
      }
    } catch (error) {
      addToast('An error occurred during sign in', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/50 dark:to-purple-950/50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-2xl animate-scale-in">
          <CardHeader className="text-center space-y-4 pb-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50 relative">
                <Sparkles className="h-8 w-8 text-white animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-50 blur-xl" />
              </div>
            </div>
            <div>
              <CardTitle className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Sign in to your account to continue
              </CardDescription>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-12 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-12 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-2" />
                  <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-2 pb-8">
              <Button 
                type="submit" 
                className="w-full h-12 group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 border-0 font-semibold text-base" 
                size="lg" 
                loading={loading}
              >
                {!loading && (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
              
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
