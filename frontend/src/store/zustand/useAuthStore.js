import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: true,
        error: null,

        setUser: (user) => set({ user, isLoading: false, error: null }),
        clearUser: () => set({ user: null, isLoading: false, error: null }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error, isLoading: false }),

        // Derived
        isAuthenticated: () => !!get().user,
        hasRole: (...roles) => roles.includes(get().user?.role),
        isSuperAdmin: () => get().user?.role === 'SUPER_ADMIN',
        isSchoolAdmin: () => get().user?.role === 'SCHOOL_ADMIN',
        isTeacher: () => get().user?.role === 'TEACHER',
        isStudent: () => get().user?.role === 'STUDENT',
        isParent: () => get().user?.role === 'PARENT',
      }),
      {
        name: 'sms-auth',
        partialize: (state) => ({ user: state.user }),
      }
    ),
    { name: 'AuthStore' }
  )
);
