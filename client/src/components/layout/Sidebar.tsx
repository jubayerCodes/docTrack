'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Stethoscope, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
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
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

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
          <Link href="/doctors" className="flex items-center gap-2.5 overflow-hidden">
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
                item.href === '/doctors'
                  ? pathname === '/doctors' || pathname === '/'
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

      {/* Footer Info & Collapse Toggle */}
      <div className="p-3 border-t border-[#292a44] space-y-2">
        {!sidebarCollapsed && (
          <div className="bg-[#18192b] rounded-lg p-2.5 border border-[#262740]">
            <div className="flex items-center gap-1.5 text-[10px] text-[#36a890] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36a890] animate-pulse" />
              <span>Express API & Atlas</span>
            </div>
            <p className="text-[10px] text-[#777b8d] mt-0.5 truncate">Active Port: 5000</p>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          type="button"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full h-8 flex items-center justify-center rounded-md text-[#777b8d] hover:text-white hover:bg-sidebar-hover transition-colors text-xs"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
