import { CsStatusId } from "@/lib/status";
import { base, en, Faker } from "@faker-js/faker";
import localforage from "localforage";

export const faker = new Faker({
  locale: [base, en],
});

export type CustomerSubaccount = [
  {
    customerID: string;
    FXID: string;
    FXStatus: 1 | 2 | 3;
  },
  {
    customerID: string;
    BOID: string;
    BOStatus: 1 | 2 | 3;
  }
];

const generateCustomerSubaccount = (customerID: string): CustomerSubaccount => {
  const FXID = faker.finance.accountNumber(5) + " FX";
  const FXStatus = faker.number.int({ min: 1, max: 3 }) as 1 | 2 | 3;
  const BOID = faker.finance.accountNumber(5) + " BO";
  const BOStatus = faker.number.int({ min: 1, max: 3 }) as 1 | 2 | 3;
  return [
    {
      customerID,
      FXID,
      FXStatus,
    },
    {
      customerID,
      BOID,
      BOStatus,
    },
  ];
};

export type CustomerReview = {
  reviwA: string;
  reviwB: string;
  reviwC: string;
  reviwD: string;
  reviwE: string;
  conculusion: string;
};

const generateCustomerReview = (): CustomerReview => {
  const reviwA = faker.datatype.boolean() ? faker.lorem.lines(1) : "";
  const reviwB = faker.datatype.boolean() ? faker.lorem.lines(1) : "";
  const reviwC = faker.datatype.boolean() ? faker.lorem.lines(1) : "";
  const reviwD = faker.datatype.boolean() ? faker.lorem.lines(1) : "";
  const reviwE = faker.datatype.boolean() ? faker.lorem.lines(1) : "";

  const conculusion = faker.lorem.lines(1);

  return {
    reviwA,
    reviwB,
    reviwC,
    reviwD,
    reviwE,
    conculusion,
  };
};

export type CustomerInfo = {
  customerName: string;
  customerID: string;
  mailAddress: string;
  telephone: string;
  address: string;
  status: CsStatusId;
  mynumber: string;
  zipcode: string;
  birthdayYYYY: number;
  birthdayMM: number;
  birthdayDD: number;
  subaccounts: CustomerSubaccount;
  review: CustomerReview;
  customerService: string;
};

const generateCustomer = (customerService = ""): CustomerInfo => {
  const customerName = faker.person.firstName();
  const customerID = faker.finance.accountNumber(5);
  const mailAddress = "12345@test.com";
  const telephone = faker.phone.number();
  const address = faker.location.streetAddress();
  const status = ("" + faker.number.int({ min: 1, max: 6 })) as CsStatusId;
  const mynumber = faker.finance.accountNumber(12);
  const zipcode = faker.location.zipCode();
  const birthday = faker.date.birthdate({
    min: 1900,
    max: 2000,
    mode: "year",
  });
  const birthdayYYYY = birthday.getFullYear();
  const birthdayMM = birthday.getMonth() + 1;
  const birthdayDD = birthday.getDate();
  const subaccounts = generateCustomerSubaccount(customerID);
  const review = generateCustomerReview();

  return {
    customerName,
    customerID,
    mailAddress,
    telephone,
    address,
    status,
    mynumber,
    zipcode,
    birthdayYYYY,
    birthdayMM,
    birthdayDD,
    subaccounts,
    review,
    customerService,
  };
};
const satisfication = ["A", "B", "C"] as const;

export type CustomerHistoryReview = {
  customer: CustomerInfo;
  customersReview: (typeof satisfication)[number];
};

export type CustomerServiceHistoryInfo = {
  customerServiceId: string;
  customers: CustomerHistoryReview[];
  customerServiceReview: string;
  conculusion: string;
};

const generateCustomerServiceHistoryInfo = (
  customerServiceId: string
): CustomerServiceHistoryInfo => {
  const customers = [];
  for (let i = 0; i < 5; i++) {
    customers.push({
      customer: generateCustomer(),
      customersReview:
        satisfication[
          faker.number.int({ min: 0, max: satisfication.length - 1 })
        ],
    });
  }
  const customerServiceReview = faker.lorem.lines(1);
  const conculusion = faker.lorem.lines(1);
  return {
    customerServiceId,
    customers,
    customerServiceReview,
    conculusion,
  };
};

export type CustomerService = {
  customerService: string;
  customerServiceId: string;
  customerServiceHistoryInfo: CustomerServiceHistoryInfo;
  customers: CustomerInfo[];
};

const generateCS = (): CustomerService => {
  const customerService = faker.person.firstName();
  const customerServiceId = faker.finance.accountNumber(5);
  const customerServiceHistoryInfo =
    generateCustomerServiceHistoryInfo(customerServiceId);

  const initialCustomers = [];
  for (let i = 0; i < 3; i++) {
    initialCustomers.push(generateCustomer());
  }
  return {
    customerService,
    customerServiceId,
    customerServiceHistoryInfo,
    customers: initialCustomers,
  };
};

export const generateCSs = async (n = 10, useNew = false) => {
  const css = (await localforage.getItem("csList")) as CustomerService[];
  const customers = (await localforage.getItem("cList")) as CustomerInfo[];
  if (!useNew && css && customers) {
    return { customerServices: css, customers };
  } else {
    const customers: CustomerInfo[] = [];
    for (let i = 0; i < 50; i++) {
      customers.push(generateCustomer());
    }

    const cs: CustomerService[] = [];
    for (let i = 0; i < n; i++) {
      cs.push(generateCS());
    }
    const result = { customerServices: cs, customers };
    await localforage.setItem("csList", cs);
    await localforage.setItem("cList", customers);
    return result;
  }
};
