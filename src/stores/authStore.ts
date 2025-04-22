import { create } from "zustand";

interface Provider {
  name: string;
  npiNumber: string;
}

interface SignupFormState {
  name: string;
  email: string;
  password: string;
  practiceName: string;
  zipCode: string;
  providerLicenseNo: string;
  subscriptionType: string;
  profilePicUrl: string;
  providers: Provider[];
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPracticeName: (practiceName: string) => void;
  setZipCode: (zipCode: string) => void;
  setProviderLicenseNo: (providerLicenseNo: string) => void;
  setSubscriptionType: (subscriptionType: string) => void;
  setProfilePicUrl: (profilePicUrl: string) => void;
  setProviders: (providers: Provider[]) => void;
  resetForm: () => void;
}

const useSignupFormStore = create<SignupFormState>((set) => ({
  name: "",
  email: "",
  password: "",
  practiceName: "",
  zipCode: "",
  providerLicenseNo: "",
  subscriptionType: "",
  profilePicUrl: "",
  providers: [],

  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setPracticeName: (practiceName) => set({ practiceName }),
  setZipCode: (zipCode) => set({ zipCode }),
  setProviderLicenseNo: (providerLicenseNo) => set({ providerLicenseNo }),
  setSubscriptionType: (subscriptionType) => set({ subscriptionType }),
  setProfilePicUrl: (profilePicUrl) => set({ profilePicUrl }),
  setProviders: (providers) => set({ providers }),

  resetForm: () =>
    set({
      name: "",
      email: "",
      password: "",
      practiceName: "",
      zipCode: "",
      providerLicenseNo: "",
      subscriptionType: "",
      profilePicUrl: "",
      providers: [],
    }),
}));

export default useSignupFormStore;
