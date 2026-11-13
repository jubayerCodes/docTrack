'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  UserCheck,
  CalendarDays,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Doctors', href: '/doctors', icon: Stethoscope },
  { name: 'Patients', href: '/patients', icon: UserCheck },
  { name: 'Sessions', href: '/sessions', icon: CalendarDays },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 bottom-0 z-40 bg-sidebar text-white flex flex-col justify-between transition-all duration-200 border-r border-[#292a44]',
        sidebarCollapsed ? 'w-16' : 'w-[220px]'
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#292a44]">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            {/* Brand Logo: dual rounded marks (purple + teal) */}
            <div className="flex items-center gap-1 flex-shrink-0 -rotate-12">
              <span className="w-2.5 h-6 rounded-full bg-primary block" />
              <span className="w-2.5 h-6 rounded-full bg-[#2c9a8b] block" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-heading font-bold text-lg text-white tracking-tight">
                DocTrack
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="p-2.5">
          {!sidebarCollapsed && (
            <p className="px-3 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.17em] text-[#777b8d]">
              Portal Menu
            </p>
          )}

          <nav className="space-y-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard' || pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-xs font-semibold transition-all group',
                    isActive
                      ? 'bg-sidebar-active text-white'
                      : 'text-[#999ba8] hover:bg-sidebar-hover hover:text-white'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 flex-shrink-0 transition-colors',
                      isActive ? 'text-primary-soft' : 'text-[#777b8d] group-hover:text-white'
                    )}
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Centered Logout Button */}
      <div className="p-3 border-t border-[#292a44]">
        <button
          onClick={handleLogout}
          type="button"
          disabled={isLoggingOut}
          title={sidebarCollapsed ? 'Logout' : undefined}
          aria-label="Logout of DocTrack"
          className={cn(
            'w-full flex items-center justify-center gap-2 rounded-lg text-xs font-medium transition-all group border border-transparent',
            'text-[#999ba8] hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none',
            'h-10 px-3'
          )}
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 flex-shrink-0 text-rose-400 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 flex-shrink-0 text-[#777b8d] group-hover:text-rose-400 transition-colors" />
          )}
          {!sidebarCollapsed && (
            <span className="font-semibold">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
