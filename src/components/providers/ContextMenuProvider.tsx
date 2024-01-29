import { CustomerInfo } from "@/TestData/fakeData";
import { create } from "zustand";

type CustomerContextMenu = {
  costumer?: CustomerInfo;
  setCustomer: (costumer: CustomerInfo) => void;
  resetCustomer: () => void;
};

export const useDiffCustomerServiceList = create<CustomerContextMenu>(
  (set) => ({
    costumer: undefined,
    setCustomer: (costumer: CustomerInfo) => {
      set({ costumer });
    },
    resetCustomer: () => {
      set({ costumer: undefined });
    },
  })
);
