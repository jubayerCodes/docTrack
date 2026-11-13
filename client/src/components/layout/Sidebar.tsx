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
  X,
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
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
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
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#121324]/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 lg:z-30 bg-sidebar text-white flex flex-col justify-between transition-all duration-200 border-r border-[#292a44]',
          // Mobile drawer: slides in from left, fixed width 64
          'w-64 max-w-[80vw]',
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          // Desktop: permanently positioned, width depends on sidebarCollapsed
          'lg:translate-x-0',
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-[220px]'
        )}
      >
        {/* Brand Header */}
        <div>
          <div className="h-14 px-4 flex items-center justify-between border-b border-[#292a44]">
            <Link
              href="/dashboard"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              {/* Brand Logo: dual rounded marks (purple + teal) */}
              <div className="flex items-center gap-1 flex-shrink-0 -rotate-12">
                <span className="w-2.5 h-6 rounded-full bg-primary block" />
                <span className="w-2.5 h-6 rounded-full bg-[#2c9a8b] block" />
              </div>
              <span
                className={cn(
                  'font-heading font-bold text-lg text-white tracking-tight',
                  sidebarCollapsed ? 'lg:hidden' : 'block'
                )}
              >
                DocTrack
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close mobile navigation menu"
              className="lg:hidden w-8 h-8 rounded-control border border-[#292a44] flex items-center justify-center text-[#999ba8] hover:text-white hover:bg-sidebar-hover transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="p-2.5">
            <p
              className={cn(
                'px-3 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.17em] text-[#777b8d]',
                sidebarCollapsed ? 'lg:hidden' : 'block'
              )}
            >
              Portal Menu
            </p>

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
                    onClick={() => setMobileSidebarOpen(false)}
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
                    <span className={cn('truncate', sidebarCollapsed ? 'lg:hidden' : 'inline')}>
                      {item.name}
                    </span>
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
            <span
              className={cn(
                'font-semibold',
                sidebarCollapsed ? 'lg:hidden' : 'inline'
              )}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
