import { CustomerInfo } from "@/TestData/fakeData";
import { create } from "zustand";

type DiffCustomers = {
  customerListFrom: CustomerInfo[];
  customerListTo: CustomerInfo[];
  setCustomerListFrom: (customerListFrom: CustomerInfo[]) => void;
  setCustomerListTo: (customerListTo: CustomerInfo[]) => void;
};

export const useDiffCustomerServiceList = create<DiffCustomers>((set) => ({
  customerListFrom: [],
  customerListTo: [],
  setCustomerListFrom: (customerListFrom: CustomerInfo[]) => {
    set({ customerListFrom });
  },
  setCustomerListTo: (customerListTo: CustomerInfo[]) => {
    set({ customerListTo });
  },
}));
