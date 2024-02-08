import { create } from "zustand";

type DisplayMode = "listMode" | "blockMode";

type Mode = {
  mode: DisplayMode;
  changeMode: () => void;
};

export const useMode = create<Mode>((set) => ({
  mode: "listMode",
  changeMode: () => {
    set((state) => ({
      mode: state.mode === "listMode" ? "blockMode" : "listMode",
    }));
  },
}));
