import React from 'react';
import { useUIStore } from '../../store/zustand/useUIStore';
import { ConfirmModal } from './Modal';

const GlobalConfirmDialog = () => {
  const confirm = useUIStore((s) => s.confirm);
  const closeConfirm = useUIStore((s) => s.closeConfirm);

  const handleConfirm = () => {
    confirm.onConfirm?.();
    closeConfirm();
  };

  return (
    <ConfirmModal
      isOpen={confirm.open}
      onClose={closeConfirm}
      onConfirm={handleConfirm}
      title={confirm.title || 'Confirm Action'}
      message={confirm.message || 'Are you sure?'}
      confirmVariant={confirm.danger ? 'danger' : 'primary'}
    />
  );
};

export default GlobalConfirmDialog;
