import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  lastAvatarFetch?: string | null;
  subscriptionType?: string | null;
  subscribedAt?: string | null;
  isYearly?: boolean;
  zipCode?: string | null;
  isAdmin?: boolean;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: () => boolean;
  formData: Record<string, any> | null;

  setAuth: (payload: {
    accessToken: string;
    refreshToken: string | null;
    user: User;
  }) => void;

  setFormData: (data: Record<string, any>) => void;
  updateUser: (patch: Partial<User>) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      formData: null,

      setAuth: ({ accessToken, refreshToken, user }) =>
        set(() => ({
          accessToken,
          refreshToken: refreshToken ?? null,
          user,
        })),

      setFormData: (data) =>
        set(() => ({
          formData: data,
        })),
      updateUser: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : {})),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          formData: null,
        }),
      isAuthenticated: () => !!get().accessToken && !!get().user,
    }),
    {
      name: "auth", // storage key
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : (undefined as any)
      ),
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
      }),
    }
  )
);
