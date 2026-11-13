'use client';

import React from 'react';
import { PanelLeft, Search, Bell } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

export const TopBar: React.FC = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-30 h-14 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Sidebar Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          type="button"
          aria-label="Toggle sidebar navigation"
          className="w-8 h-8 rounded-control border border-border flex items-center justify-center text-textSecondary hover:text-ink hover:bg-surface-subtle transition-colors"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

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
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64">
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
          className="w-8 h-8 rounded-control border border-border flex items-center justify-center text-textSecondary hover:text-ink hover:bg-surface-subtle transition-colors relative"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-2 right-2" />
        </button>

        {/* Administrator Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-ink leading-tight">Admin System</p>
            <p className="text-[10px] text-textMuted leading-tight">Chief Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
