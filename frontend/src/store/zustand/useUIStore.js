import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useUIStore = create(
  devtools(
    (set, get) => ({
      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Modal
      modal: { open: false, type: null, data: null },
      openModal: (type, data = null) => set({ modal: { open: true, type, data } }),
      closeModal: () => set({ modal: { open: false, type: null, data: null } }),

      // Confirm dialog
      confirm: { open: false, title: '', message: '', onConfirm: null, danger: false },
      openConfirm: ({ title, message, onConfirm, danger = false }) =>
        set({ confirm: { open: true, title, message, onConfirm, danger } }),
      closeConfirm: () =>
        set({ confirm: { open: false, title: '', message: '', onConfirm: null, danger: false } }),

      // Toast notifications
      toasts: [],
      addToast: ({ type = 'info', title, message, duration = 4000 }) => {
        const id = Date.now() + Math.random();
        set((s) => ({ toasts: [...s.toasts, { id, type, title, message }] }));
        if (duration > 0) {
          setTimeout(() => get().removeToast(id), duration);
        }
        return id;
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      toast: {
        success: (title, message) =>
          useUIStore.getState().addToast({ type: 'success', title, message }),
        error: (title, message) =>
          useUIStore.getState().addToast({ type: 'error', title, message }),
        info: (title, message) =>
          useUIStore.getState().addToast({ type: 'info', title, message }),
        warning: (title, message) =>
          useUIStore.getState().addToast({ type: 'warning', title, message }),
      },
    }),
    { name: 'UIStore' }
  )
);

// Standalone toast helper usable outside React components
export const toast = {
  success: (title, message) => useUIStore.getState().addToast({ type: 'success', title, message }),
  error: (title, message) => useUIStore.getState().addToast({ type: 'error', title, message }),
  info: (title, message) => useUIStore.getState().addToast({ type: 'info', title, message }),
  warning: (title, message) => useUIStore.getState().addToast({ type: 'warning', title, message }),
};
