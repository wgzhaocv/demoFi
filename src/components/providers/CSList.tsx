import { CustomerInfo, CustomerServiceHistoryInfo } from "@/TestData/fakeData";
import { create } from "zustand";

export interface CSListState {
  customerServiceHistory?: CustomerServiceHistoryInfo;
  customerInfo?: CustomerInfo;
  setCustomerInfo: (customerInfo: CustomerInfo) => void;
  setCustomerServiceHistory: (
    customerServiceHistory: CustomerServiceHistoryInfo
  ) => void;
}

export const useCustomerServiceList = create<CSListState>((set) => ({
  customerServiceHistory: undefined,
  customerInfo: undefined,
  setCustomerInfo: (customerInfo: CustomerInfo) => {
    set({ customerInfo });
  },
  setCustomerServiceHistory: (
    customerServiceHistory: CustomerServiceHistoryInfo
  ) => {
    set({ customerServiceHistory });
  },
}));
