import {
  CustomerHistoryReview,
  CustomerInfo,
  CustomerServiceHistoryInfo,
} from "@/TestData/fakeData";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@radix-ui/themes";
import { useCustomerServiceList } from "@/components/providers/CSList";
import "./CustomerReview.css";
import clsx from "clsx";
import { motion, useInView } from "framer-motion";
import { useNavigate, useLocation } from "react-router";

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
      setCustomerInfo: (customerInfo: CustomerInfo) => void;
    }
  | {
      asTitle: boolean;
      cols: columns[];
    };

const CustomerServiceHistoryRow = React.memo(
  (props: CustomerServiceHistoryRowProps) => {
    const { t } = useTranslation();
    if ("asTitle" in props) {
      return (
        <div className="customer-history-row bg-indigo-200 sticky ">
          {props.cols.map((col) => {
            return (
              <div key={col.name} className="customer-history-cell">
                {t(col.name)}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div
        onClick={() => props.setCustomerInfo(props.customerReview.customer)}
        className={clsx(
          "customer-history-row hover:bg-indigo-300/10",
          props.selected && "bg-indigo-200/60 hover:bg-indigo-200/60"
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
                <Text>
                  {props.customerReview.customer[col.name] as unknown as string}
                </Text>
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
  setCustomerInfo: (customerInfo: CustomerInfo) => void;
};

const CustomerServiceHistory = React.memo(
  ({
    cusutomerServiceSummary,
    customerInfo,
    setCustomerInfo,
  }: CustomerServiceHistoryProps) => {
    const [cols] = React.useState<columns[]>([
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
        <div className="h-[fit-content] min-w-[850px] flex flex-col border-b border-zinc-400/90">
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
                setCustomerInfo={setCustomerInfo}
                selected={
                  customerInfo?.customerID ===
                  customerWithReview.customer.customerID
                }
              />
            ))}
          </div>
        </div>

        <div className="h-[200px] min-w-[800px] flex-shrink-0 flex-grow-0 place-content-end p-1">
          <div className="w-full font-semibold">
            {t("CS Evaluation") + t(": ")}
          </div>
          <pre className="w-full">{text}</pre>
          <div>
            {t("conclusion") +
              t(": ") +
              ((cusutomerServiceSummary &&
                cusutomerServiceSummary?.conculusion) ??
                "")}
          </div>
        </div>
      </div>
    );
  }
);

type CustomerReviewDetailProps = { customerInfo?: CustomerInfo };

const CustomerReviewDetail = React.memo(
  React.forwardRef<
    { scrollIntoView: (dep: string) => void },
    CustomerReviewDetailProps
  >(({ customerInfo }: CustomerReviewDetailProps, ref) => {
    const refA = React.useRef<HTMLDivElement>(null);
    const refB = React.useRef<HTMLDivElement>(null);
    const refC = React.useRef<HTMLDivElement>(null);
    const refD = React.useRef<HTMLDivElement>(null);
    const refE = React.useRef<HTMLDivElement>(null);

    const refMap = {
      A: refA,
      B: refB,
      C: refC,
      D: refD,
      E: refE,
    };

    const depScrollIntoView = React.useCallback((dep: string) => {
      const ref = refMap[dep as keyof typeof refMap];
      if (ref && ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
        });

        ref.current.classList.add("bg-indigo-200/60");
        setTimeout(() => {
          ref.current?.classList.remove("bg-indigo-200/60");
        }, 1000);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useImperativeHandle(ref, () => ({
      scrollIntoView: depScrollIntoView,
    }));

    const { t } = useTranslation();
    const text =
      "取引可能前ステータスの顧客は前に気になるステータスを記入（該当顧客の審査フロー追跡など）\n取引可能な顧客は取引履歴をリストする";
    return (
      <div className="w-full h-full flex flex-col justify-between items-center">
        <ReviewHeader name={customerInfo?.customerName ?? ""} />
        <div className="w-full min-h-[200px] flex-grow border-b border-zinc-400/90">
          <pre className="h-full">{text}</pre>
        </div>
        <div className="w-full h-[200px] flex-shrink-0 flex-grow-0 p-1">
          <div className="font-semibold">{t("Csutomer Evaluation") + ":"}</div>
          <div>{t("Data Analysis Results")}</div>
          {customerInfo && customerInfo.review.reviwA && (
            <div
              ref={refA}
              className="flex flex-nowrap transition-colors duration-500"
            >
              <pre className="flex items-center justify-start flex-grow-0 flex-shrink-0">
                {t("reviwA") + t(": ")}
              </pre>
              <pre>{customerInfo.review.reviwA}</pre>
            </div>
          )}
          {customerInfo && customerInfo.review.reviwB && (
            <div
              ref={refB}
              className="flex flex-nowrap transition-colors duration-500"
            >
              <div className="flex items-center justify-start flex-grow-0 flex-shrink-0">
                {t("reviwB") + t(": ")}
              </div>
              <pre>{customerInfo.review.reviwB}</pre>
            </div>
          )}
          {customerInfo && customerInfo.review.reviwC && (
            <div
              ref={refC}
              className="flex flex-nowrap transition-colors duration-500"
            >
              <pre className="flex items-center justify-start flex-grow-0 flex-shrink-0">
                {t("reviwC") + t(": ")}
              </pre>
              <pre>{customerInfo.review.reviwC}</pre>
            </div>
          )}
          {customerInfo && customerInfo.review.reviwD && (
            <div
              ref={refD}
              className="flex flex-nowrap transition-colors duration-500"
            >
              <pre className="flex items-center justify-start flex-grow-0 flex-shrink-0">
                {t("reviwD") + t(": ")}
              </pre>
              <pre>{customerInfo.review.reviwD}</pre>
            </div>
          )}
          {customerInfo && customerInfo.review.reviwE && (
            <div
              ref={refE}
              className="flex flex-nowrap transition-colors duration-500"
            >
              <pre className="flex items-center justify-start flex-grow-0 flex-shrink-0">
                {t("reviwE") + t(": ")}
              </pre>
              <pre>{customerInfo.review.reviwE}</pre>
            </div>
          )}
          <div>
            {t("conclusion") +
              t(": ") +
              ((customerInfo && customerInfo?.review.conculusion) ?? "")}
          </div>
        </div>
      </div>
    );
  })
);

export const CustomerReview = React.memo(() => {
  const {
    customerInfo,
    customerServiceHistory,
    setCustomerInfo,
    highlightDep,
    // clearHighlightDep,
  } = useCustomerServiceList();
  const ref = React.useRef<HTMLDivElement>(null);
  const lastCustomerAndServiceHistory = React.useRef<{
    customerInfo?: CustomerInfo;
    customerServiceHistory?: CustomerServiceHistoryInfo;
    dep?: string;
  }>({});
  const customerDetailRef = React.useRef<{
    scrollIntoView: (dep: string) => void;
  }>(null);

  useEffect(() => {
    if (lastCustomerAndServiceHistory.current.dep !== highlightDep) {
      lastCustomerAndServiceHistory.current = {
        dep: highlightDep,
      };

      if (highlightDep) {
        customerDetailRef.current?.scrollIntoView(highlightDep);
      }
    }
  }, [customerInfo, customerServiceHistory, highlightDep]);
  const [open, setOpen] = React.useState<-1 | 0 | 1>(0);
  const viewref = React.useRef(null);
  const isInView = useInView(viewref);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!isInView) {
      navigate(location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);
  return (
    <section
      ref={ref}
      id="customerReview"
      className="w-[90vw] h-[30vh] mt-5 rounded-lg shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/10 relative flex"
    >
      <motion.div
        ref={viewref}
        className="flex-grow-0 flex-shrink-0 overflow-auto"
        animate={{
          width: open === -1 ? "100px" : open === 1 ? "85vw" : "auto",
        }}
      >
        <CustomerServiceHistory
          cusutomerServiceSummary={customerServiceHistory}
          setCustomerInfo={setCustomerInfo}
          customerInfo={customerInfo}
        />
      </motion.div>
      <div className="h-full flex flex-col justify-center gap-24 bg-zinc-400/30 sticky top-0 flex-grow-0 flex-shrink-0">
        <Button
          variant="ghost"
          className="mx-auto p-0 h-[fit-content]"
          onClick={() => {
            setOpen((pre) => {
              if (pre === -1) return -1;
              return (pre - 1) as -1 | 0;
            });
          }}
        >
          <ChevronsLeft className="w-5 h-5 mx-auto text-zinc-900/50" />
        </Button>
        <Button
          variant="ghost"
          className="mx-auto p-0 h-[fit-content]"
          onClick={() => {
            setOpen((pre) => {
              if (pre === 1) return 1;
              return (pre + 1) as 1 | 0;
            });
          }}
        >
          <ChevronsRight className="w-5 h-5 mx-auto text-zinc-900/50" />
        </Button>
      </div>
      <div className="flex-grow overflow-auto">
        <CustomerReviewDetail
          ref={customerDetailRef}
          customerInfo={customerInfo}
        />
      </div>
    </section>
  );
});
