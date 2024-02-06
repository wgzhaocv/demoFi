import { CustomerInfo } from "@/TestData/fakeData";

export const customerContextMenuList = [
  {
    id: "1",
    label: "Edit",
    onClick: () => {
      console.log("Edit");
    },
  },
  {
    id: "3",
    label: "Check",
    onClick: () => {
      console.log("Add");
    },
  },
  {
    id: "4",
    label: "More",
    sub: [
      {
        id: "5",
        label: "Asign CS",
        onClick: () => {
          console.log("Add Note");
        },
      },
      {
        id: "6",
        label: "Change Status",
        onClick: () => {
          console.log("Add Task");
        },
      },
    ],
  },
  {
    id: "2",
    label: "Delete",
    alert: true,
    onClick: () => {
      console.log("Delete");
    },
  },
] as {
  id: string;
  label: string;
  onClick: (customer: CustomerInfo) => void;
  alert?: boolean;
  sub?: {
    id: string;
    label: string;
    onClick: (customer: CustomerInfo) => void;
  }[];
}[];

export type CustomerContextMenuList = typeof customerContextMenuList;
