'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemType,
  confirmText = 'Delete Permanently',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Confirm Deletion"
      title={title}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3.5 p-3.5 rounded-card bg-semantic-dangerBg/60 border border-semantic-danger/20">
          <div className="w-9 h-9 rounded-full bg-semantic-danger/10 text-semantic-danger flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-semantic-danger" />
          </div>
          <div className="text-xs text-ink leading-relaxed space-y-1">
            {itemName && (
              <p className="font-semibold text-semantic-danger">
                {itemType
                  ? `Are you sure you want to delete ${itemType} "${itemName}"?`
                  : `Are you sure you want to delete "${itemName}"?`}
              </p>
            )}
            <p className="text-textSecondary">
              {description ||
                'This action cannot be undone. This record and associated links will be permanently removed from the system.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
