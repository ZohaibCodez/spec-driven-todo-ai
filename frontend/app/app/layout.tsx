import * as React from 'react';
import { SessionChecker } from '@/components/auth/SessionChecker';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionChecker />
      {children}
    </>
  );
}
