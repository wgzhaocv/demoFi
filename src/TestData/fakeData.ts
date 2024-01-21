import { CsStatusId } from "@/lib/status";
import { base, ja, Faker } from "@faker-js/faker";
import localforage from "localforage";

export const faker = new Faker({
  locale: [base, ja],
});

type CustomerSubaccount = [
  {
    customerID: string;
    FXID: string;
    FXStatus: number;
  },
  {
    customerID: string;
    BOID: string;
    BOStatus: number;
  }
];

const generateCustomerSubaccount = (customerID: string): CustomerSubaccount => {
  const FXID = faker.finance.accountNumber(5) + " FX";
  const FXStatus = faker.number.int({ min: 1, max: 3 });
  const BOID = faker.finance.accountNumber(5) + " BO";
  const BOStatus = faker.number.int({ min: 1, max: 3 });
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

type CustomerReview = {
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

type Customer = {
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
};

const generateCustomer = (): Customer => {
  const customerName = faker.person.firstName();
  const customerID = faker.finance.accountNumber(5);
  const mailAddress = faker.internet.email();
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
  };
};
const satisfication = ["A", "B", "C"] as const;

type CustomerServiceHistoryInfo = {
  customerServiceId: string;
  customers: {
    customer: Customer;
    customersReview: (typeof satisfication)[number];
  }[];
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

type CustomerService = {
  customerService: string;
  customerServiceId: string;
  customerServiceHistoryInfo: CustomerServiceHistoryInfo;
  customers: Customer[];
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

const generateCSs = async (n = 10, useNew = false) => {
  if (!useNew) {
    return (await localforage.getItem("csList")) as CustomerService[];
  } else {
    const customers: Customer[] = [];
    for (let i = 0; i < 50; i++) {
      customers.push(generateCustomer());
    }

    const cs: CustomerService[] = [];
    for (let i = 0; i < n; i++) {
      cs.push(generateCS());
    }
    return cs;
  }
};
