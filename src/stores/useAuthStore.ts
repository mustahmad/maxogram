import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
  }) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Login failed");
          }

          const json = await res.json();
          const payload = json.data ?? json;
          set({ user: payload.user, token: payload.token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: {
        username: string;
        email: string;
        password: string;
        fullName: string;
      }) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Registration failed");
          }

          const json = await res.json();
          const payload = json.data ?? json;
          set({ user: payload.user, token: payload.token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      initialize: async () => {
        const { token } = get();
        if (!token) {
          set({ user: null, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            set({ user: null, token: null, isLoading: false });
            return;
          }

          const json = await res.json();
          const payload = json.data ?? json;
          set({ user: payload.user ?? payload, isLoading: false });
        } catch {
          set({ user: null, token: null, isLoading: false });
        }
      },
    }),
    {
      name: "maxogram-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
