import { create } from "zustand";

export type ItemName =
  | "customerService"
  | "customerID"
  | "customerName"
  | "mailAddress"
  | "telephone"
  | "status";

interface ItemsWidthState {
  itemWidth: {
    customerService: number;
    customerID: number;
    customerName: number;
    mailAddress: number;
    telephone: number;
    status: number;
  };
  changeW: (by: number, item: ItemName) => void;
}

export const useCSItemWStore = create<ItemsWidthState>()((set) => ({
  itemWidth: {
    customerService: 100,
    customerID: 150,
    customerName: 150,
    mailAddress: 150,
    telephone: 150,
    status: 150,
  },
  changeW: (by, item) => set(() => ({ [item]: by })),
}));

export type CustomerListItemName =
  | "customerName"
  | "customerID"
  | "mailAddress"
  | "telephone"
  | "address";

interface CustomerListItemsWidthState {
  customerListItemWidth: {
    customerName: number;
    customerID: number;
    mailAddress: number;
    telephone: number;
    address: number;
  };
  changeW: (by: number, item: CustomerListItemName) => void;
}
export const useCustomerListItemWStore = create<CustomerListItemsWidthState>(
  (set) => ({
    customerListItemWidth: {
      customerName: 150,
      customerID: 150,
      mailAddress: 150,
      telephone: 150,
      address: 150,
    },
    changeW: (by, item) => set(() => ({ [item]: by })),
  })
);
