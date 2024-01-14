export const csStatus = [
  {
    id: "1",
    name: "Application",
  },
  {
    id: "2",
    name: "Document Application",
  },
  {
    id: "3",
    name: "Document Check",
  },
  {
    id: "4",
    name: "Account Opening Application",
  },
  {
    id: "5",
    name: "Application Confirmed",
  },
  {
    id: "6",
    name: "Application Complete",
  },
];

export const csStatusMap = {
  "1": "Application",
  "2": "Document Application",
  "3": "Document Check",
  "4": "Account Opening Application",
  "5": "Application Confirmed",
  "6": "Application Complete",
};

export const allStatusId = Object.keys(csStatusMap) as CsStatusId[];

export type CsStatus = (typeof csStatus)[number]["name"];
export type CsStatusId = keyof typeof csStatusMap;
