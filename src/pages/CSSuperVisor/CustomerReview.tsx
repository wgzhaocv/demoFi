import {
  CustomerHistoryReview,
  CustomerInfo,
  CustomerServiceHistoryInfo,
} from "@/TestData/fakeData";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Link, Text, Tooltip } from "@radix-ui/themes";
import { useCustomerServiceList } from "@/components/providers/CSList";
import "./CustomerReview.css";
import clsx from "clsx";

type ReviewHeaderProps = {
  name: string;
  isCs?: boolean;
};

const ReviewHeader = React.memo(({ name, isCs }: ReviewHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-[45px] flex flex-grow-0 flex-shrink-0 border-b border-zinc-400/90">
      <div className="w-40 font-semibold flex-grow-0 flex-shrink-0 text-wrap flex items-center px-1">
        {name}
      </div>
      <div className="font-semibold flex-1 capitalize text-wrap flex items-center p-2">
        {t(isCs ? "Customer Service" : "Customer") + t(": ") + name}
        {t("analytical value")}
      </div>
    </div>
  );
});

type columns = { name: keyof CustomerInfo | "customersReview" };

type CustomerServiceHistoryRowProps =
  | {
      customerReview: CustomerHistoryReview;
      cols: columns[];
      selected: boolean;
    }
  | {
      asTitle: boolean;
      cols: columns[];
    };

const CustomerServiceHistoryRow = React.memo(
  (props: CustomerServiceHistoryRowProps) => {
    if ("asTitle" in props) {
      const { t } = useTranslation();
      return (
        <div className="customer-history-row bg-pink-200 sticky ">
          {props.cols.map((col) => {
            return <div className="customer-history-cell">{t(col.name)}</div>;
          })}
        </div>
      );
    }
    return (
      <div
        className={clsx(
          "customer-history-row",
          props.selected && "bg-pink-200/60"
        )}
      >
        {props.cols.map((col) => {
          if (col.name === "customersReview") {
            return (
              <div key={col.name} className="customer-history-cell">
                <Text>{props.customerReview.customersReview}</Text>
              </div>
            );
          } else {
            return (
              <div key={col.name} className="customer-history-cell">
                <Text>{props.customerReview.customer[col.name]}</Text>
              </div>
            );
          }
        })}
      </div>
    );
  }
);

type CustomerServiceHistoryProps = {
  cusutomerServiceSummary?: CustomerServiceHistoryInfo;
  customerInfo?: CustomerInfo;
};

const CustomerServiceHistory = React.memo(
  ({ cusutomerServiceSummary, customerInfo }: CustomerServiceHistoryProps) => {
    const [cols, setCols] = React.useState<columns[]>([
      { name: "customerName" },
      { name: "customerID" },
      { name: "mailAddress" },
      { name: "address" },
      { name: "customersReview" },
    ]);
    const { t } = useTranslation();
    const text =
      "処理時間、顧客数、処理満足度など分析データのBIデータ分析\n処理時間、顧客数、処理満足度など分析データのBIデータ分析\n処理時間、顧客数、処理満足度など分析データのBIデータ分析\n処理時間、顧客数、処理満足度など分析データのBIデータ分析";
    return (
      <div className="h-full flex flex-col justify-between ">
        <div className="h-full w-full flex flex-col border-b border-zinc-400/90">
          <ReviewHeader
            name={cusutomerServiceSummary?.customerServiceId ?? ""}
            isCs
          />
          <CustomerServiceHistoryRow asTitle cols={cols} />
          <div className="w-full flex flex-col">
            {cusutomerServiceSummary?.customers.map((customerWithReview) => (
              <CustomerServiceHistoryRow
                key={customerWithReview.customer.customerID}
                customerReview={customerWithReview}
                cols={cols}
                selected={
                  customerInfo?.customerID ===
                  customerWithReview.customer.customerID
                }
              />
            ))}
          </div>
        </div>

        <div className="h-[200px] flex-shrink-0 flex-grow-0 place-content-end">
          <div className="w-full font-semibold">{t("CS Evaluation")}</div>
          <pre className="w-full">{text}</pre>
          <div>{t("conclusion") + t(": ")}</div>
        </div>
      </div>
    );
  }
);

type CustomerReviewDetailProps = { customerInfo?: CustomerInfo };

const CustomerReviewDetail = React.memo(
  ({ customerInfo }: CustomerReviewDetailProps) => {
    const { t } = useTranslation();
    const text =
      "取引可能前ステータスの顧客は前に気になるステータスを記入（該当顧客の審査フロー追跡など）\n取引可能な顧客は取引履歴をリストする";
    return (
      <div className="w-full h-full flex flex-col justify-between items-center">
        <ReviewHeader name={customerInfo?.customerName ?? ""} />
        <div className="w-full flex-grow border-b border-zinc-400/90">
          <pre className="h-full">{text}</pre>
        </div>
        <div className="w-full h-[200px] flex-shrink-0 flex-grow-0 overflow-auto">
          <div className="font-semibold">{t("Csutomer Evaluation") + ":"}</div>
          <div>{t("Data Analysis Results")}</div>
        </div>
      </div>
    );
  }
);

type CustomerReviewProps = {};

export const CustomerReview = React.memo(({}: CustomerReviewProps) => {
  const { customerInfo, customerServiceHistory } = useCustomerServiceList();
  const ref = React.useRef<HTMLDivElement>(null);
  const lastCustomerAndServiceHistory = React.useRef<{
    customerInfo?: CustomerInfo;
    customerServiceHistory?: CustomerServiceHistoryInfo;
  }>({});

  useEffect(() => {
    if (
      lastCustomerAndServiceHistory.current.customerInfo !== customerInfo ||
      lastCustomerAndServiceHistory.current.customerServiceHistory !==
        customerServiceHistory
    ) {
      lastCustomerAndServiceHistory.current = {
        customerInfo,
        customerServiceHistory,
      };
      ref.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [customerInfo, customerServiceHistory]);
  return (
    <section
      ref={ref}
      id="customerReview"
      className="w-full h-[80vh] rounded-lg shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/10 relative flex"
    >
      <div className="flex-grow-0 flex-shrink-0">
        <CustomerServiceHistory
          cusutomerServiceSummary={customerServiceHistory}
        />
      </div>
      <div className="h-full flex flex-col justify-center gap-48 bg-zinc-400/30 sticky top-0 flex-grow-0 flex-shrink-0">
        <Button variant="ghost" className="mx-auto p-0 h-[fit-content]">
          <ChevronsLeft className="w-5 h-5 mx-auto text-zinc-900/50" />
        </Button>
        <Button variant="ghost" className="mx-auto p-0 h-[fit-content]">
          <ChevronsRight className="w-5 h-5 mx-auto text-zinc-900/50" />
        </Button>
      </div>
      <div className="flex-grow overflow-auto">
        <CustomerReviewDetail customerInfo={customerInfo} />
      </div>
    </section>
  );
});
