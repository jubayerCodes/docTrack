'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { ShieldCheck, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { IUser } from '@/types';

export interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  user: IUser | null;
  targetRole: 'admin' | 'user';
  isLoading?: boolean;
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  targetRole,
  isLoading = false,
}) => {
  if (!user) return null;

  const isPromoting = targetRole === 'admin';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow={isPromoting ? 'Access Control Elevation' : 'Access Control Restriction'}
      title={isPromoting ? 'Promote User to Administrator' : 'Demote User to Standard User'}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div
          className={`flex items-start gap-3.5 p-3.5 rounded-card border ${
            isPromoting
              ? 'bg-primary-soft/50 border-primary/20'
              : 'bg-amber-500/10 border-amber-500/20'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isPromoting
                ? 'bg-primary/10 text-primary'
                : 'bg-amber-500/15 text-amber-600'
            }`}
          >
            {isPromoting ? (
              <ShieldCheck className="w-5 h-5 text-primary" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div className="text-xs text-ink leading-relaxed space-y-1">
            <p className="font-semibold">
              {isPromoting ? (
                <span>
                  Grant administrator privileges to{' '}
                  <span className="text-primary font-bold">{user.name}</span>?
                </span>
              ) : (
                <span>
                  Demote <span className="font-bold text-ink">{user.name}</span> to standard user?
                </span>
              )}
            </p>
            <p className="text-textSecondary">
              {isPromoting
                ? `Promoting this user grants them full administrative rights to manage physicians, patient records, clinical sessions, and system user roles.`
                : `Demoting this user restricts their access strictly to the analytics dashboard. They will no longer have access to doctors, patients, sessions, or user management.`}
            </p>
          </div>
        </div>

        <div className="bg-surface-subtle p-3 rounded-control border border-border text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-textMuted font-medium">User Email:</span>
            <span className="font-mono text-ink font-semibold">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-textMuted font-medium">Target Privilege:</span>
            <span
              className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] ${
                isPromoting
                  ? 'bg-primary-soft text-primary border border-primary/20'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {targetRole === 'admin' ? 'System Administrator' : 'Standard User'}
            </span>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isPromoting ? 'primary' : 'destructive'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            {isPromoting ? (
              <>
                <span>Promote to Admin</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </>
            ) : (
              <>
                <span>Demote to User</span>
                <ArrowDownRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
