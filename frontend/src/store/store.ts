import { create } from "zustand";
import { UserModel } from "../models/auth";

type GlobalState = {
  user?: UserModel;
  setUser: (user?: UserModel) => void;
};

export const useStore = create<GlobalState>((set) => ({
  setUser: async (user?: UserModel) => set({ user }),
}));
