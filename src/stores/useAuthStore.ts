import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { allUsers, currentMockUser } from "@/data/users";

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

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 300));

        const found = allUsers.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
        );

        if (!found) {
          set({ isLoading: false });
          throw new Error("Invalid email or password");
        }

        set({
          user: found,
          token: "mock-jwt-token",
          isLoading: false,
        });
      },

      register: async (data: {
        username: string;
        email: string;
        password: string;
        fullName: string;
      }) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 300));

        const existingEmail = allUsers.find(
          (u) => u.email?.toLowerCase() === data.email.toLowerCase()
        );
        if (existingEmail) {
          set({ isLoading: false });
          throw new Error("Email already in use");
        }

        const existingUsername = allUsers.find(
          (u) => u.username.toLowerCase() === data.username.toLowerCase()
        );
        if (existingUsername) {
          set({ isLoading: false });
          throw new Error("Username already taken");
        }

        // For static mock, just return the current mock user with overridden fields
        const newUser: User = {
          ...currentMockUser,
          id: `user-${Date.now()}`,
          username: data.username,
          displayName: data.fullName,
          email: data.email,
        };

        set({
          user: newUser,
          token: "mock-jwt-token",
          isLoading: false,
        });
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
        await new Promise((r) => setTimeout(r, 300));

        // If we have a persisted token, restore the persisted user or fall back to current mock user
        const { user } = get();
        set({ user: user ?? currentMockUser, isLoading: false });
      },
    }),
    {
      name: "maxogram-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
