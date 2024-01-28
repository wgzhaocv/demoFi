import { CustomerInfo, CustomerReview } from "@/TestData/fakeData";
import { useDiffCustomerServiceList } from "@/components/providers/allCustomers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const diffCustomer = (customer1: CustomerInfo, customer2: CustomerInfo) => {
  if (customer1 === customer2) return null;
  const diff: Record<string, [string | number, string | number]> = {};

  for (const key in customer1) {
    const localKey = key as keyof CustomerInfo;
    if (localKey === "subaccounts") {
      if (customer1.subaccounts === customer2.subaccounts) continue;
      customer1.subaccounts.forEach((subaccount, index) => {
        //
      });
    } else if (localKey === "review") {
      if (customer1.review === customer2.review) continue;

      Object.keys(customer1.review).forEach((reviewKey) => {
        const localReviewKey = reviewKey as keyof CustomerReview;
        if (
          customer1.review[localReviewKey] !== customer2.review[localReviewKey]
        ) {
          diff["review:" + localReviewKey] = [
            customer1.review[localReviewKey],
            customer2.review[localReviewKey],
          ];
        }
      });
    } else {
      if (customer1[localKey] !== customer2[localKey]) {
        diff[key] = [customer1[localKey], customer2[localKey]];
      }
    }
  }

  return diff;
};

type CustomerDiff = {
  customerID: string;
  customerName: string;
  diff: Record<string, [string | number, string | number]>;
};

export const DiffDialog = () => {
  const [openDiff, setOpenDiff] = React.useState(false);
  const { customerListFrom, customerListTo } = useDiffCustomerServiceList();
  const { t } = useTranslation();
  const [customerDiff, setCustomerDiff] = React.useState<CustomerDiff[]>([]);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const customerFromMap = customerListFrom.reduce((acc, cur) => {
    acc[cur.customerID] = cur;
    return acc;
  }, {} as Record<string, CustomerInfo>);

  const computeDiff = () => {
    const allCustomersDiff: CustomerDiff[] = [];
    customerListTo.forEach((customer) => {
      const customerFrom = customerFromMap[customer.customerID];
      const diff = diffCustomer(customerFrom, customer);
      if (diff) {
        allCustomersDiff.push({
          customerID: customer.customerID,
          customerName: customer.customerName,
          diff,
        });
      }
    });

    return allCustomersDiff;
  };

  React.useEffect(() => {
    setCustomerDiff(
      computeDiff().sort((a, b) => a.customerID.localeCompare(b.customerID))
    );
  }, [openDiff]);

  const handleConfirmDiff = () => {
    toast.success(t("Diff Reflected"));
  };

  const handleClickCustomer = (customerID: string) => {
    if (contentRef.current) {
      const target = contentRef.current.querySelector(`#${"c" + customerID}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <Dialog open={openDiff} onOpenChange={setOpenDiff}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="fixed right-[50%] -translate-x-[50%] top-5 z-40"
        >
          {t("confirm")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Confirm Customer Changes")}</DialogTitle>
          <DialogDescription>
            {customerDiff.length === 0 && (
              <div className="my-2">{t("No Changes")}</div>
            )}
            {customerDiff.length > 0 && (
              <div className="max-h-[70vh] flex items-center">
                <div className="flex gap-2">
                  <div className="h-full mr-2 mt-4 overflow-auto">
                    <div className="font-bold mb-2 text-black text-sm">
                      {t("Changed Customers")}
                    </div>
                    {customerDiff.map((customer) => (
                      <div
                        key={customer.customerID}
                        className="mb-2 last:mb-0 hover:underline cursor-pointer"
                        onClick={() => handleClickCustomer(customer.customerID)}
                      >
                        {customer.customerName}
                      </div>
                    ))}
                  </div>
                  <div
                    ref={contentRef}
                    className="max-h-[60vh] py-2 flex flex-col overflow-auto"
                  >
                    {customerDiff.map((customer) => (
                      <div
                        key={customer.customerID}
                        className="w-full mb-4 last:mb-0 flex flex-col"
                      >
                        <h2
                          className="mb-2 text-lg font-semibold text-black"
                          id={"c" + customer.customerID}
                        >
                          {customer.customerName}
                        </h2>
                        <div className="w-full flex flex-nowrap border-y border-zinc-800  text-zinc-800">
                          <div className=" h-full w-32 border-x border-zinc-800 flex-grow-0 flex-shrink-0 font-bold flex items-center">
                            {t("Item Name")}
                          </div>
                          <div className="h-full w-52 border-r border-zinc-800 flex-grow-0 flex-shrink-0 font-bold flex items-center">
                            {t("Before Change")}
                          </div>
                          <div className=" h-full w-52 border-r border-zinc-800 flex-grow-0 flex-shrink-0 font-bold flex items-center">
                            {t("After Change")}
                          </div>
                        </div>
                        {Object.keys(customer.diff).map((key) => {
                          let localKey = key.split(":");
                          return (
                            <div
                              key={key}
                              className="w-full flex flex-nowrap border-b border-zinc-800"
                            >
                              <div className="text-zinc-800 h-full  border-x border-zinc-800 w-32 flex-grow-0 flex-shrink-0 flex items-center">
                                <pre>
                                  {localKey.reduce((pre, cur, i) => {
                                    if (i === 0) return pre + t(cur);
                                    return pre + "\n  " + cur;
                                  }, "")}
                                </pre>
                              </div>
                              <div className="text-zinc-700 h-auto  border-r border-zinc-800 w-52 flex-grow-0 flex-shrink-0 flex items-center">
                                <span className="bg-pink-300/80 text-pink-950/90">
                                  {customer.diff[key][0]}
                                </span>
                              </div>
                              <div className="text-zinc-700  h-auto  border-r border-zinc-800 w-52 flex-grow-0 flex-shrink-0 flex items-center">
                                <span className="bg-green-200 text-green-900">
                                  {customer.diff[key][1]}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDiff(false)}>
              {t("cancel")}
            </Button>
            <Button
              variant={"default"}
              disabled={customerDiff.length === 0}
              onClick={() => {
                handleConfirmDiff();
                setOpenDiff(false);
              }}
              className="flex items-center justify-center"
            >
              {t("confirm")}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
