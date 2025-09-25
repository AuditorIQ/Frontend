import { create } from "zustand";

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  credentials: "MD" | "DO" | "DPM";
  npiNumber: string;
}

interface SignupFormState {
  name: string;
  email: string;
  password: string;
  practiceName: string;
  zipCode: string;
  subscriptionType: string;
  profilePicUrl: string;
  providers: Provider[];
  isYearly: boolean;
  subscribedAt: string;
  billingMode: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPracticeName: (practiceName: string) => void;
  setZipCode: (zipCode: string) => void;
  setSubscriptionType: (subscriptionType: string) => void;
  setProfilePicUrl: (profilePicUrl: string) => void;
  setProviders: (providers: Provider[]) => void;
  setisYearly: (isYearly: boolean) => void;
  setsubscribedAt: (subscribedAt: string) => void;
  setbillingMode: (billingMode: string) => void;
  resetForm: () => void;
}

const useSignupFormStore = create<SignupFormState>((set) => ({
  name: "",
  email: "",
  password: "",
  practiceName: "",
  zipCode: "",
  subscriptionType: "",
  profilePicUrl: "",
  providers: [],
  isYearly: false,
  subscribedAt: "",
  billingMode: "",

  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setPracticeName: (practiceName) => set({ practiceName }),
  setZipCode: (zipCode) => set({ zipCode }),
  setSubscriptionType: (subscriptionType) => set({ subscriptionType }),
  setProfilePicUrl: (profilePicUrl) => set({ profilePicUrl }),
  setProviders: (providers) => set({ providers }),
  setisYearly: (isYearly) => set({ isYearly }),
  setsubscribedAt: (subscribedAt) => set({ subscribedAt }),
  setbillingMode: (billingMode) => set({ billingMode }),

  resetForm: () =>
    set({
      name: "",
      email: "",
      password: "",
      practiceName: "",
      zipCode: "",
      subscriptionType: "",
      profilePicUrl: "",
      providers: [],
      isYearly: false,
      subscribedAt: "",
      billingMode: "",
    }),
}));

export default useSignupFormStore;
