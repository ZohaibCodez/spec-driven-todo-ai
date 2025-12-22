'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { getSession } from '@/lib/auth-client';
import { User, Mail, Save } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session?.data?.session) {
        router.push('/login');
      } else {
        setEmail(session.data.user?.email || '');
        setName(session.data.user?.name || '');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const session = await getSession();
      const token = session?.data?.session?.token;
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:8000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update local storage with new user data
      const currentSession = localStorage.getItem('auth_session');
      if (currentSession) {
        const sessionData = JSON.parse(currentSession);
        sessionData.user = updatedUser;
        localStorage.setItem('auth_session', JSON.stringify(sessionData));
      }

      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950/30">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your account information
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information Card */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Personal Information</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Update your personal details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    disabled
                    className="h-11 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 border-0"
                  loading={loading}
                >
                  {!loading && (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Statistics Card */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Account Statistics</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Your activity overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">0</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">0</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Member Since</p>
                  <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
