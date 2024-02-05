import { CustomerInfo } from "@/TestData/fakeData";
import { create } from "zustand";

type CustomContextMenuDataType = {
  position?: { x: number; y: number };
  customer?: CustomerInfo;
  setData: (data: CustomerInfo) => (event: React.MouseEvent) => void;
  clearData: () => void;
};

export const useCustomContextMenu = create<CustomContextMenuDataType>(
  (set) => ({
    position: undefined,
    customer: undefined,
    setData: (customer: CustomerInfo) => (event: React.MouseEvent) => {
      event.preventDefault();
      set({ customer, position: { x: event.clientX, y: event.clientY } });
    },
    clearData: () => {
      set({ customer: undefined, position: undefined });
    },
  })
);
