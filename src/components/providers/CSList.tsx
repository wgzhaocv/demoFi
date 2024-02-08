import { CustomerInfo, CustomerServiceHistoryInfo } from "@/TestData/fakeData";
import { create } from "zustand";

export interface CSListState {
  customerServiceHistory?: CustomerServiceHistoryInfo;
  customerInfo?: CustomerInfo;
  highlightDep: string;
  setCustomerInfo: (customerInfo: CustomerInfo) => void;
  setHightlightDep: (dep: string) => void;
  clearHighlightDep: () => void;
  setCustomerServiceHistory: (
    customerServiceHistory: CustomerServiceHistoryInfo
  ) => void;
}

export const useCustomerServiceList = create<CSListState>((set) => ({
  customerServiceHistory: undefined,
  customerInfo: undefined,
  highlightDep: "",
  setCustomerInfo: (customerInfo: CustomerInfo) => {
    set({ customerInfo });
  },
  setCustomerServiceHistory: (
    customerServiceHistory: CustomerServiceHistoryInfo
  ) => {
    set({ customerServiceHistory });
  },
  setHightlightDep: (dep: string) => {
    set({ highlightDep: dep });
  },
  clearHighlightDep: () => {
    set({ highlightDep: "" });
  },
}));
