'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  UserCheck,
  Search,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  AlertCircle,
  Clock,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SelectDropdown } from '@/components/ui/SelectDropdown';
import { ActionMenu, ActionMenuItem } from '@/components/ui/ActionMenu';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { ChangeRoleModal } from '@/components/ui/ChangeRoleModal';
import { TableSkeleton, CardListSkeleton } from '@/components/ui/Skeleton';
import { useUsers, useUserMutations } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate, getInitials } from '@/lib/utils';
import { IUser } from '@/types';

const ROLE_FILTERS = [
  { label: 'All Roles', value: 'all' },
  { label: 'Administrators Only', value: 'admin' },
  { label: 'Standard Users Only', value: 'user' },
];

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { data, isLoading, isFetching, isError, error, refetch } = useUsers();
  const { updateUserRole, deleteUser } = useUserMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal states
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [roleChangeState, setRoleChangeState] = useState<{
    user: IUser;
    targetRole: 'admin' | 'user';
  } | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 250);

  const allUsers: IUser[] = useMemo(() => data?.data || [], [data?.data]);

  // Aggregate stats
  const totalCount = allUsers.length;
  const adminCount = useMemo(
    () => allUsers.filter((u) => u.role === 'admin').length,
    [allUsers]
  );
  const standardCount = useMemo(
    () => allUsers.filter((u) => u.role === 'user').length,
    [allUsers]
  );

  // Filtered list
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      // Role filter
      if (selectedRoleFilter !== 'all' && user.role !== selectedRoleFilter) {
        return false;
      }
      // Search query filter
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchesName = user.name.toLowerCase().includes(query);
        const matchesEmail = user.email.toLowerCase().includes(query);
        return matchesName || matchesEmail;
      }
      return true;
    });
  }, [allUsers, selectedRoleFilter, debouncedSearch]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedRoleFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRoleFilter('all');
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setActionError(null);
    try {
      await deleteUser.mutateAsync(userToDelete.id);
      setUserToDelete(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete user account.';
      setActionError(message);
    }
  };

  const handleConfirmRoleChange = async () => {
    if (!roleChangeState) return;
    setActionError(null);
    try {
      await updateUserRole.mutateAsync({
        id: roleChangeState.user.id,
        role: roleChangeState.targetRole,
      });
      setRoleChangeState(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update user role.';
      setActionError(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1">
            Access &amp; Identity Administration
          </p>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink">
            User Management
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Oversee staff credentials, promote users to administrator, and manage system access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            isLoading={isFetching}
            title="Refresh user accounts list"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Sync Accounts</span>
          </Button>
        </div>
      </div>

      {/* Global Action Error Alert */}
      {actionError && (
        <div className="bg-semantic-dangerBg border border-semantic-danger/30 rounded-control p-3.5 flex items-start justify-between gap-3 text-semantic-danger text-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-semantic-danger/70 hover:text-semantic-danger font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: Total Users */}
        <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-textMuted uppercase tracking-wider">
              Total Portal Accounts
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-bold text-ink mt-1">
              {isLoading ? '...' : totalCount}
            </p>
            <p className="text-[11px] text-textSecondary mt-0.5">
              Verified clinical &amp; operational staff
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Administrators */}
        <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-textMuted uppercase tracking-wider">
              System Administrators
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-bold text-primary mt-1">
              {isLoading ? '...' : adminCount}
            </p>
            <p className="text-[11px] text-textSecondary mt-0.5">
              Full CRUD access to all modules
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Standard Users */}
        <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-textMuted uppercase tracking-wider">
              Standard Members
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-bold text-ink mt-1">
              {isLoading ? '...' : standardCount}
            </p>
            <p className="text-[11px] text-textSecondary mt-0.5">
              Restricted dashboard-only visibility
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-subtle text-textSecondary flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-surface rounded-card border border-border p-3.5 sm:p-4 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-textMuted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 rounded-control bg-surface-subtle border border-border text-xs text-ink placeholder:text-textSubtle focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-ink text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Role Filter Dropdown */}
          <div className="w-full sm:w-56">
            <SelectDropdown
              value={selectedRoleFilter}
              onChange={setSelectedRoleFilter}
              options={ROLE_FILTERS}
            />
          </div>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="flex-shrink-0 text-textSecondary"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Reset Filters</span>
          </Button>
        )}
      </div>

      {/* Main Content: Table on Desktop, Cards on Mobile */}
      <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle/50 text-[11px] font-bold uppercase tracking-wider text-textMuted">
                    <th className="py-3 px-4">User / Staff Member</th>
                    <th className="py-3 px-4">Portal Role</th>
                    <th className="py-3 px-4">Account Created</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <TableSkeleton rows={6} cols={5} />
                </tbody>
              </table>
            </div>
            <div className="md:hidden">
              <CardListSkeleton count={4} />
            </div>
          </div>
        ) : isError ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-semantic-dangerBg text-semantic-danger flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-ink">Failed to Load User Accounts</h3>
            <p className="text-xs text-textSecondary max-w-sm mx-auto">
              {(error as Error)?.message || 'An error occurred while communicating with the authentication backend.'}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Retry</span>
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface-subtle text-textMuted flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-ink">No User Accounts Found</h3>
            <p className="text-xs text-textSecondary max-w-sm mx-auto">
              {hasActiveFilters
                ? 'No users match your active search or filter criteria. Try adjusting your parameters.'
                : 'There are currently no registered users in the platform.'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-2">
                <span>Clear Filters</span>
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle/50 text-[11px] font-bold uppercase tracking-wider text-textMuted">
                    <th className="py-3 px-4">User / Staff Member</th>
                    <th className="py-3 px-4">Portal Role</th>
                    <th className="py-3 px-4">Account Created</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {filteredUsers.map((user) => {
                    const isSelf = user.id === currentUser?.id;
                    const isAdmin = user.role === 'admin';

                    const actionMenuItems: ActionMenuItem[] = [
                      isAdmin
                        ? {
                            label: 'Demote to User',
                            icon: <ArrowDownRight className="w-3.5 h-3.5 text-amber-600" />,
                            onClick: () => setRoleChangeState({ user, targetRole: 'user' }),
                            disabled: isSelf || updateUserRole.isPending,
                            title: isSelf ? 'You cannot demote your own administrator account' : undefined,
                          }
                        : {
                            label: 'Promote to Admin',
                            icon: <ArrowUpRight className="w-3.5 h-3.5 text-primary" />,
                            onClick: () => setRoleChangeState({ user, targetRole: 'admin' }),
                            disabled: updateUserRole.isPending,
                          },
                      {
                        label: 'Remove User',
                        icon: <Trash2 className="w-3.5 h-3.5 text-semantic-danger" />,
                        variant: 'danger',
                        onClick: () => setUserToDelete(user),
                        disabled: isSelf || deleteUser.isPending,
                        title: isSelf ? 'You cannot delete your own account' : undefined,
                      },
                    ];

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-surface-subtle/60 transition-colors group"
                      >
                        {/* User Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/20 flex-shrink-0 select-none">
                              {getInitials(user.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-ink truncate">
                                  {user.name}
                                </span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#2c9a8b]/15 text-[#2c9a8b] border border-[#2c9a8b]/20">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-textSecondary font-mono block truncate">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role Status Badge */}
                        <td className="py-3.5 px-4">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary-soft text-primary border border-primary/20">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Administrator</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                              <span>Standard User</span>
                            </span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 text-textSecondary">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-textMuted" />
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </td>

                        {/* Last Active */}
                        <td className="py-3.5 px-4 text-textSecondary">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-textMuted" />
                            <span>{user.lastSignInAt ? formatDate(user.lastSignInAt) : 'Never'}</span>
                          </div>
                        </td>

                        {/* Actions Dropdown Menu */}
                        <td className="py-3.5 px-4 text-right pr-6">
                          <div className="inline-flex justify-end">
                            <ActionMenu
                              items={actionMenuItems}
                              ariaLabel={`Actions for ${user.name}`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-border">
              {filteredUsers.map((user) => {
                const isSelf = user.id === currentUser?.id;
                const isAdmin = user.role === 'admin';

                const actionMenuItems: ActionMenuItem[] = [
                  isAdmin
                    ? {
                        label: 'Demote to User',
                        icon: <ArrowDownRight className="w-3.5 h-3.5 text-amber-600" />,
                        onClick: () => setRoleChangeState({ user, targetRole: 'user' }),
                        disabled: isSelf || updateUserRole.isPending,
                        title: isSelf ? 'You cannot demote your own administrator account' : undefined,
                      }
                    : {
                        label: 'Promote to Admin',
                        icon: <ArrowUpRight className="w-3.5 h-3.5 text-primary" />,
                        onClick: () => setRoleChangeState({ user, targetRole: 'admin' }),
                        disabled: updateUserRole.isPending,
                      },
                  {
                    label: 'Remove User',
                    icon: <Trash2 className="w-3.5 h-3.5 text-semantic-danger" />,
                    variant: 'danger',
                    onClick: () => setUserToDelete(user),
                    disabled: isSelf || deleteUser.isPending,
                    title: isSelf ? 'You cannot delete your own account' : undefined,
                  },
                ];

                return (
                  <div key={user.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/20 flex-shrink-0 select-none">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-ink text-sm truncate">{user.name}</p>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#2c9a8b]/15 text-[#2c9a8b] border border-[#2c9a8b]/20">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-textSecondary font-mono truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-soft text-primary border border-primary/20">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Admin</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <UserCheck className="w-3 h-3 text-slate-500" />
                            <span>User</span>
                          </span>
                        )}

                        <ActionMenu
                          items={actionMenuItems}
                          ariaLabel={`Actions for ${user.name}`}
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-textMuted flex items-center justify-between border-t border-border pt-2">
                      <span>Joined: {formatDate(user.createdAt)}</span>
                      <span>Active: {user.lastSignInAt ? formatDate(user.lastSignInAt) : 'Never'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal for Role Promotion/Demotion */}
      <ChangeRoleModal
        isOpen={Boolean(roleChangeState)}
        onClose={() => setRoleChangeState(null)}
        onConfirm={handleConfirmRoleChange}
        user={roleChangeState?.user || null}
        targetRole={roleChangeState?.targetRole || 'user'}
        isLoading={updateUserRole.isPending}
      />

      {/* Confirmation Modal for User Deletion */}
      <ConfirmDeleteModal
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove User Account"
        itemName={userToDelete?.name}
        itemType="user account"
        description={`Are you sure you want to permanently delete the account for "${userToDelete?.email}"? This will immediately revoke their ability to sign in to DocTrack.`}
        confirmText="Remove Account"
        isLoading={deleteUser.isPending}
      />
    </div>
  );
}
