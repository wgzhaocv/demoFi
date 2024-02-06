import { CustomerInfo } from "@/TestData/fakeData";
import { create } from "zustand";

type CheckedCustomers = {
  customers: CustomerInfo[];
  addCustomer: (customer: CustomerInfo) => void;
  removeCustomer: (customer: CustomerInfo) => void;
  addCustomers: (customers: CustomerInfo[]) => void;
  removeAllCustomers: () => void;
};

export const useCheckedCustomers = create<CheckedCustomers>((set) => ({
  customers: [],
  addCustomer: (customer: CustomerInfo) => {
    set((state) => ({
      customers: Array.from(new Set([...state.customers, customer])),
    }));
  },
  removeCustomer: (customer: CustomerInfo) => {
    set((state) => ({
      customers: state.customers.filter(
        (c) => c.customerID !== customer.customerID
      ),
    }));
  },
  addCustomers: (customers: CustomerInfo[]) => {
    set((state) => ({
      customers: Array.from(new Set([...state.customers, ...customers])),
    }));
  },
  removeAllCustomers: () => {
    set({ customers: [] });
  },
}));
