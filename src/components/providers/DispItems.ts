import { CustomeListColsAttr } from "@/pages/CSSuperVisor/ListView";
import { create } from "zustand";
import { CustomerListItemName } from "./CSItemsWidthProvider";

export interface DispCustomerItems {
  displayList: CustomeListColsAttr[];
  undisplayList: CustomeListColsAttr[];
  hide: (names: CustomerListItemName[]) => void;
  show: (names: CustomerListItemName[]) => void;
}

export const useDispItems = create<DispCustomerItems>((set) => ({
  displayList: [
    { name: "customerName", deletable: false, link: true },
    { name: "customerID", deletable: true, link: true },
    { name: "mailAddress", deletable: true, link: false },
    { name: "telephone", deletable: true, link: false },
    { name: "address", deletable: true, link: false },
  ],
  undisplayList: [
    { name: "zipcode", deletable: true, link: false },
    { name: "birthdayYYYY", deletable: true, link: false },
    { name: "birthdayMM", deletable: true, link: false },
    { name: "birthdayDD", deletable: true, link: false },
  ],
  hide: (names: CustomerListItemName[]) => {
    set((state) => {
      const displayList = state.displayList.filter(
        (item) => !names.includes(item.name)
      );
      const undisplayList = state.undisplayList.concat(
        state.displayList.filter((item) => names.includes(item.name))
      );

      return {
        displayList,
        undisplayList,
      };
    });
  },
  show: (names: CustomerListItemName[]) => {
    set((state) => {
      const undisplayList = state.undisplayList.filter(
        (item) => !names.includes(item.name)
      );
      const displayList = state.displayList.concat(
        state.undisplayList.filter((item) => names.includes(item.name))
      );

      return {
        displayList,
        undisplayList,
      };
    });
  },
}));
