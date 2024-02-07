import {
  CustomerInfo,
  boBalance,
  fxBalance,
  mainAccount,
} from "@/TestData/fakeData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { csStatusMap } from "@/lib/status";
import clsx from "clsx";
import { motion, useAnimate } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { ResponsiveLine } from "@nivo/line";
import { createPortal } from "react-dom";
import { IconButton } from "@radix-ui/themes";
type CustomerBalanceGraphProps = {
  customer: CustomerInfo;
  openGraph: boolean;
};

const CustomerBalanceGraph = React.memo(
  ({ customer, openGraph }: CustomerBalanceGraphProps) => {
    const { t } = useTranslation();
    const total = mainAccount.map((data, i) => {
      return {
        ...data,
        y: data.y + fxBalance[i].y + boBalance[i].y,
      };
    });

    return (
      <div className="w-[632px] h-[446px] grid grid-cols-3 gap-4 mt-2">
        <Card>
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-base">{t("Main Balance")}</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[130px] p-0">
            {openGraph && (
              <ResponsiveLine
                data={[
                  {
                    id: "Main",
                    color: "hsl(68, 70%, 50%)",
                    data: mainAccount,
                  },
                ]}
                margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
                colors={{ scheme: "paired" }}
                curve="monotoneX"
                enablePoints={false}
                enableGridX={false}
                enableGridY={false}
                useMesh={true}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-base">{t("FX Balance")}</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[130px] p-0">
            {openGraph && (
              <ResponsiveLine
                data={[
                  {
                    id: "FX",
                    color: "hsl(68, 70%, 50%)",
                    data: fxBalance,
                  },
                ]}
                margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
                colors={{ scheme: "nivo" }}
                curve="monotoneX"
                enablePoints={false}
                enableGridX={false}
                enableGridY={false}
                useMesh={true}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-base">{t("BO Balance")}</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[130px] p-0">
            {openGraph && (
              <ResponsiveLine
                data={[
                  {
                    id: "BO",
                    color: "hsl(68, 70%, 50%)",
                    data: boBalance,
                  },
                ]}
                margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
                colors={{ scheme: "brown_blueGreen" }}
                curve="monotoneX"
                enablePoints={false}
                enableGridX={false}
                enableGridY={false}
                useMesh={true}
              />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-base">
              {t("Total Balance") + t(": ") + customer.customerName}
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[220px] p-0">
            {openGraph && (
              <ResponsiveLine
                data={[
                  {
                    id: "Total",
                    color: "hsl(40, 70%, 50%)",
                    data: total,
                  },
                ]}
                margin={{ top: 10, right: 50, bottom: 50, left: 50 }}
                colors={{ scheme: "spectral" }}
                curve="monotoneX"
                enablePoints={false}
                enableGridX={false}
                enableGridY={false}
                axisTop={null}
                axisLeft={{
                  tickValues: [0, 1000, 2000, 3000, 4000, 5000, 6000],
                  legend: t("Balance"),
                  legendOffset: -40,
                  legendPosition: "middle",
                }}
                useMesh={true}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);

type CustommerCardSimpleProps = {
  customer: CustomerInfo;
  index: number;
  popover?: boolean;
};

export const CustommerCardSimple: React.FC<CustommerCardSimpleProps> =
  React.memo(({ customer, index, popover }: CustommerCardSimpleProps) => {
    const { t } = useTranslation();
    const ref = React.useRef(null);
    const [show, setShow] = React.useState(true);

    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Draggable
          draggableId={customer.customerID}
          key={customer.customerID}
          index={index}
          isDragDisabled={Boolean(popover)}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={clsx(
                "customer-block-card cursor-pointer",
                popover && "z-200 h-[fit-content]",
                !show && "invisible"
              )}
            >
              {!popover && (
                <div className={clsx("w-full flex items-center justify-end")}>
                  <IconButton
                    variant="ghost"
                    radius="full"
                    size={"1"}
                    onClick={() => setOpen((pre) => !pre)}
                  >
                    <Maximize2 className="w-3 h-3" />
                  </IconButton>
                </div>
              )}
              <div ref={ref} className={clsx("w-full flex")}>
                <label className="w-[80px] text-sm font-semibold text-zinc-900/90 flex-grow-0 flex-shrink-0">
                  {t("customerName") + t(": ")}
                </label>
                <div className="flex-1 text-nowrap ">
                  {customer.customerName}
                </div>
              </div>
              <div className="w-full flex">
                <label className="w-[80px]  text-sm font-semibold text-zinc-900/90 flex-grow-0 flex-shrink-0">
                  {t("telephone") + t(": ")}
                </label>
                <div className="flex-1 text-nowrap ">{customer.telephone}</div>
              </div>
              <div className="w-full flex">
                <label className="w-[80px] text-sm font-semibold text-zinc-900/90 flex-grow-0 flex-shrink-0">
                  {t("status") + t(": ")}
                </label>
                <div className="flex-1 text-nowrap ">
                  {t(csStatusMap[customer.status])}
                </div>
              </div>
            </div>
          )}
        </Draggable>
        <CustomerDialog
          customer={customer}
          open={open}
          setOpen={setOpen}
          parentRef={ref}
          setShow={setShow}
        />
      </>
    );
  });

type CustommerDialogProps = {
  customer: CustomerInfo;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  parentRef: React.MutableRefObject<null | HTMLDivElement>;
};

export const CustomerDialog: React.FC<CustommerDialogProps> = React.memo(
  ({ customer, open, setOpen, setShow, parentRef }: CustommerDialogProps) => {
    const { t } = useTranslation();
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const [localOpen, setLocalOpen] = React.useState(open);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (open || localOpen) {
        setShow(false);
      } else {
        setShow(true);
      }
    }, [open, localOpen, setShow]);

    useEffect(() => {
      if (open) {
        const srcEle = parentRef.current?.parentElement;

        const destEle = scope.current;
        if (!srcEle || !destEle) return;

        const { top, left, width, height } = srcEle.getBoundingClientRect();
        const {
          top: top2,
          left: left2,
          width: width2,
          height: height2,
        } = destEle.getBoundingClientRect();

        const deltaX = left2 + width2 / 2 - (left + width / 2);
        const deltaY = top2 + height2 / 2 - (top + height / 2);

        animate(
          destEle,
          {
            x: [-~~deltaX, 0],
            y: [-~~deltaY, 0],
            width: [width, width2],
            height: [height, height2],
          },
          {
            duration: 0.3,
            onComplete() {
              setLocalOpen(true);
            },
          }
        );
      } else {
        const srcEle = parentRef.current?.parentElement;

        const destEle = scope.current;
        if (!srcEle || !destEle) return;

        const { top, left, width, height } = srcEle.getBoundingClientRect();
        const {
          top: top2,
          left: left2,
          width: width2,
          height: height2,
        } = destEle.getBoundingClientRect();

        const deltaX = left2 + width2 / 2 - (left + width / 2);
        const deltaY = top2 + height2 / 2 - (top + height / 2);

        const headerEle = headerRef.current;
        if (headerEle) {
          animate(headerEle, {
            maxHeight: [80, 25],
          });
        }

        animate(
          destEle.parentElement as HTMLDivElement,
          {
            backgroundColor: ["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0)"],
          },
          {
            duration: 0.3,
          }
        );

        animate(
          destEle,
          {
            x: [0, -~~deltaX],
            y: [0, -~~deltaY],
            width: [width2, width],
            height: [height2, height],
          },
          {
            duration: 0.3,
            onComplete() {
              setLocalOpen(false);
            },
          }
        );
      }
    }, [animate, open, parentRef, scope]);

    useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <>
        {(localOpen || open) &&
          createPortal(
            <motion.div
              initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
              animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              transition={{ duration: 0.3 }}
              className={clsx(
                "fixed inset-0 z-200 flex items-center justify-center"
              )}
              onClick={() => {
                setOpen(false);
              }}
            >
              <Card ref={scope} className="overflow-hidden z-201" onClick={(e)=>e.stopPropagation()}>
                <motion.div
                  initial={{
                    maxHeight:60,
                  }}
                  animate={{
                    maxHeight: 80,
                  }}
                  ref={headerRef}
                  className="w-full flex flex-row items-center justify-between pr-2 flex-nowrap overflow-hidden"
                >
                  <CardHeader className="flex-1 p-2">
                    <CardTitle>{customer.customerName}</CardTitle>
                  </CardHeader>
                  <IconButton
                    variant="ghost"
                    radius="full"
                    className="hover:bg-indigo-100 w-4 h-4 rounded-full block "
                    size={"1"}
                    onClick={() => setOpen((pre) => !pre)}
                  >
                    <Minimize2 className="w-3 h-3" />
                  </IconButton>
                </motion.div>

                <CardContent className="p-2">
                  <div className={clsx("w-full flex")}>
                    <label className="w-[80px] text-sm font-semibold text-zinc-900/90 flex-grow-0 flex-shrink-0">
                      {t("customerName") + t(": ")}
                    </label>
                    <div className="flex-1 text-nowrap ">
                      {customer.customerName}
                    </div>
                  </div>
                  <div className="w-full flex">
                    <label className="w-[80px]  text-sm font-semibold text-zinc-900/90 flex-grow-0 flex-shrink-0">
                      {t("telephone") + t(": ")}
                    </label>
                    <div className="flex-1 text-nowrap ">
                      {customer.telephone}
                    </div>
                  </div>
                  <div className="w-full flex">
                    <label className="w-[80px] text-sm font-semibold text-zinc-900/90 flex-grow-0 flex-shrink-0">
                      {t("status") + t(": ")}
                    </label>
                    <div className="flex-1 text-nowrap ">
                      {t(csStatusMap[customer.status])}
                    </div>
                  </div>
                  <CustomerBalanceGraph
                    openGraph={localOpen}
                    customer={customer}
                  />
                </CardContent>
              </Card>
            </motion.div>,
            document.body
          )}
      </>
    );
  }
);
