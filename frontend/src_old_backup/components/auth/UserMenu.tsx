'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear the token and update state
      await logout();
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, still clear local state
      logout();
      router.push('/signin');
    }
  };

  if (!user) {
    return null; // Don't show menu if user is not authenticated
  }

  return (
    <div className="ml-4 flex items-center md:ml-6">
      {/* Profile dropdown */}
      <div className="relative ml-3">
        <div className="flex space-x-4">
          <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">
            Welcome, {user.name || user.email}!
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}