'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useUIStore } from '@/store/useUIStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();
  const { isLoading, user } = useAuth();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Auth pages (e.g. /login, /register) render standalone without sidebar or top navigation
  if (isAuthPage) {
    return <div className="min-h-screen bg-appBackground text-ink">{children}</div>;
  }

  // Initial authentication check: show brand loading screen to prevent UI flickering
  if (isLoading) {
    return (
      <div className="min-h-screen bg-appBackground flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 -rotate-12 animate-pulse">
            <span className="w-3 h-8 rounded-full bg-primary block" />
            <span className="w-3 h-8 rounded-full bg-[#2c9a8b] block" />
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated users are redirected by AuthProvider / middleware
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-appBackground text-ink flex flex-col">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-200',
          'ml-0',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[220px]'
        )}
      >
        <TopBar />
        <main className="flex-1 p-3.5 sm:p-5 lg:p-8 max-w-[1600px] w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
