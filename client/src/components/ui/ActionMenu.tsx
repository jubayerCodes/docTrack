'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  title?: string;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  ariaLabel?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ items, ariaLabel = 'Actions' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; openUpwards: boolean }>({
    top: 0,
    left: 0,
    openUpwards: false,
  });

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuHeight = items.length * 36 + 16;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpwards = spaceBelow < menuHeight && rect.top > menuHeight;
      const menuWidth = 176;

      const calculatedLeft = Math.min(
        Math.max(8, rect.right - menuWidth),
        typeof window !== 'undefined' ? window.innerWidth - menuWidth - 8 : 12
      );

      setCoords({
        top: openUpwards ? Math.max(8, rect.top - menuHeight) : rect.bottom + 4,
        left: calculatedLeft,
        openUpwards,
      });
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Do not close if click occurred inside the trigger button OR inside the menu itself
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = (e: Event) => {
      if (e.target === document || e.target === document.documentElement || e.target === document.body) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', () => setIsOpen(false));
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', () => setIsOpen(false));
    };
  }, [isOpen]);

  const handleItemClick = (e: React.MouseEvent, item: ActionMenuItem) => {
    e.stopPropagation();
    e.preventDefault();
    if (item.disabled) return;
    setIsOpen(false);
    item.onClick();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleMenu}
        aria-label={ariaLabel}
        className={cn(
          'w-8 h-8 rounded-control border border-transparent hover:border-border hover:bg-surface-subtle flex items-center justify-center text-textMuted hover:text-ink transition-colors',
          isOpen && 'bg-surface-subtle border-border text-ink'
        )}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Fixed Portal Positioning Menu */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 99999,
            }}
            className="w-44 rounded-control bg-surface border border-border shadow-dropdown p-1 animate-in fade-in zoom-in-95 duration-150"
          >
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                disabled={item.disabled}
                title={item.title}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => handleItemClick(e, item)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left',
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed text-textMuted'
                    : item.variant === 'danger'
                    ? 'text-semantic-danger hover:bg-semantic-dangerBg cursor-pointer'
                    : 'text-ink hover:bg-surface-subtle cursor-pointer'
                )}
              >
                {item.icon && <span className="w-3.5 h-3.5 flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};
