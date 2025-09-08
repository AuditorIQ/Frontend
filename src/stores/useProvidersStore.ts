import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Provider = {
  id: number;
  firstName: string;
  lastName: string;
  credentials: "MD" | "DO" | "DPM";
  npiNumber: string;
  zipCode?: string;
  specialty?: "Woundcare" | "Podiatry";
};

type ProvidersState = {
  providers: Provider[];
  setProviders: (list: Provider[]) => void;
  addProvider: (p: Provider) => void;
  removeProvider: (id: number) => void;
  clearProviders: () => void;
};

export const useProvidersStore = create<ProvidersState>()(
  persist(
    (set) => ({
      providers: [],
      setProviders: (list) => set({ providers: list }),
      addProvider: (p) => set((s) => ({ providers: [p, ...s.providers] })), // prepend for visibility
      removeProvider: (id) =>
        set((s) => ({ providers: s.providers.filter((p) => p.id !== id) })),
      clearProviders: () => set({ providers: [] }),
    }),
    {
      name: "providers", // session persistence so refresh still shows data
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : (undefined as any)
      ),
    }
  )
);
