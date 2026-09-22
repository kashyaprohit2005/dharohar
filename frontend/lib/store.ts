import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  artisanId: number | null;
  craftproofId: string | null;
  fullName: string | null;
  token: string | null;
  userType: 'artisan' | 'verifier' | null;
  login: (artisanId: number, craftproofId: string, fullName: string, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      artisanId: null,
      craftproofId: null,
      fullName: null,
      token: null,
      userType: null,
      login: (artisanId: number, craftproofId: string, fullName: string, token: string) =>
        set({ artisanId, craftproofId, fullName, token, userType: 'artisan' }),
      logout: () => set({ artisanId: null, craftproofId: null, fullName: null, token: null, userType: null }),
      isAuthenticated: () => !!get().token,
    }),
    { name: 'virasatsetu-auth' }
  )
);
