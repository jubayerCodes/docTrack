'use client';

import React from 'react';
import { PanelLeft, Search, Bell, Menu } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useAuth } from '@/hooks/useAuth';

export const TopBar: React.FC = () => {
  const { toggleSidebar, toggleMobileSidebar } = useUIStore();
  const { user } = useAuth();

  const handleToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  };

  // Compute initials and displayName
  const displayName =
    (user?.user_metadata?.name as string) ||
    (user?.email ? user.email.split('@')[0] : 'Admin System');

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || 'AD';

  const userRole = (user?.user_metadata?.role as string) || 'Chief Administrator';

  return (
    <header className="sticky top-0 z-20 h-14 bg-surface border-b border-border px-3.5 sm:px-6 flex items-center justify-between">
      {/* Left: Sidebar Toggle + Breadcrumb / Mobile Brand */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={handleToggle}
          type="button"
          aria-label="Toggle navigation menu"
          className="w-8 h-8 rounded-control border border-border flex items-center justify-center text-textSecondary hover:text-ink hover:bg-surface-subtle transition-colors flex-shrink-0"
        >
          {/* Mobile hamburger vs Desktop panel icon */}
          <span className="lg:hidden">
            <Menu className="w-4 h-4" />
          </span>
          <span className="hidden lg:block">
            <PanelLeft className="w-4 h-4" />
          </span>
        </button>

        {/* Mobile Brand indicator */}
        <div className="flex items-center gap-2 sm:hidden">
          <div className="flex items-center gap-0.5 -rotate-12">
            <span className="w-2 h-4 rounded-full bg-primary block" />
            <span className="w-2 h-4 rounded-full bg-[#2c9a8b] block" />
          </div>
          <span className="font-heading font-bold text-sm text-ink tracking-tight">
            DocTrack
          </span>
        </div>

        {/* Desktop / Tablet Breadcrumb */}
        <div className="hidden sm:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-textMuted">
            Care Network
          </p>
          <h1 className="text-xs font-bold text-ink leading-none">
            DocTrack Administration
          </h1>
        </div>
      </div>

      {/* Right: Global Search & Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Bar (hidden on mobile, visible on tablet & laptop & desktop) */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 text-textMuted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records... (Ctrl+K)"
            className="w-full h-8 pl-8 pr-12 rounded-control bg-surface-subtle border border-border text-xs text-ink placeholder:text-textSubtle focus:outline-none focus:border-primary focus:bg-white transition-all"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-textSubtle bg-white border border-border px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="w-8 h-8 rounded-control border border-border flex items-center justify-center text-textSecondary hover:text-ink hover:bg-surface-subtle transition-colors relative flex-shrink-0"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-2 right-2" />
        </button>

        {/* Administrator Profile Details */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div
            title={user?.email || 'Administrator'}
            className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/20 select-none flex-shrink-0"
          >
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-ink leading-tight capitalize truncate max-w-[100px] lg:max-w-[130px]">
              {displayName}
            </p>
            <p className="hidden lg:block text-[10px] text-textMuted leading-tight capitalize truncate max-w-[130px]">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
