import { CustomerInfo } from "@/TestData/fakeData";
import { create } from "zustand";

type MultiSelectedCustomers = {
  selectedCustomers: CustomerInfo[];
  leftFlag: boolean;

  selectLeft: (customer: CustomerInfo) => (event: React.MouseEvent) => void;
  selectRight: (customer: CustomerInfo) => (event: React.MouseEvent) => void;
};

export const useMultiSelectedCustomers = create<MultiSelectedCustomers>(
  (set) => ({
    selectedCustomers: [],
    leftFlag: true,
    selectLeft: (customer: CustomerInfo) => (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      set((state) => {
        if (state.selectedCustomers.includes(customer)) {
          return {
            selectedCustomers: state.selectedCustomers.filter(
              (c) => c !== customer
            ),
            leftFlag: true,
          };
        }
        return {
          selectedCustomers: [...state.selectedCustomers, customer],
          leftFlag: true,
        };
      });
    },
    selectRight: (customer: CustomerInfo) => (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      set((state) => {
        if (state.selectedCustomers.includes(customer)) {
          return {
            selectedCustomers: state.selectedCustomers.filter(
              (c) => c !== customer
            ),
            leftFlag: false,
          };
        }
        return {
          selectedCustomers: [...state.selectedCustomers, customer],
          leftFlag: false,
        };
      });
    },
  })
);
