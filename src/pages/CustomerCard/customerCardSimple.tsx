import { CustomerInfo } from "@/TestData/fakeData";
import { csStatusMap } from "@/lib/status";
import { IconButton } from "@radix-ui/themes";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";

type CustommerCardSimpleProps = {
  customer: CustomerInfo;
  index: number;
  popover?: boolean;
};

export const CustommerCardSimple: React.FC<CustommerCardSimpleProps> =
  React.memo(({ customer, index, popover }: CustommerCardSimpleProps) => {
    const { t } = useTranslation();

    return (
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
              popover && "z-200 h-[fit-content]"
            )}
          >
            <div className={clsx("w-full flex")}>
              <label className="w-1/3 text-sm font-semibold text-zinc-900/90 flex-grow-0 flex-shrink-0">
                {t("customerName") + t(": ")}
              </label>
              <div className="flex-1 text-nowrap whitespace-nowrap overflow-hidden">
                {customer.customerName}
              </div>
            </div>
            <div className="w-full flex">
              <label className="w-1/3  text-sm font-semibold text-zinc-900/90 flex-grow-0 flex-shrink-0">
                {t("telephone") + t(": ")}
              </label>
              <div className="flex-1 text-nowrap whitespace-nowrap overflow-hidden">
                {customer.telephone}
              </div>
            </div>
            <div className="w-full flex">
              <label className="w-1/3 text-sm font-semibold text-zinc-900/90 flex-grow-0 flex-shrink-0">
                {t("status") + t(": ")}
              </label>
              <div className="flex-1 text-nowrap whitespace-nowrap overflow-hidden">
                {t(csStatusMap[customer.status])}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  });

type CustommerCardProps = {
  customer: CustomerInfo;
  index: number;
  popover: boolean;
};

export const CustomerCard: React.FC<CustommerCardProps> = React.memo(
  ({ customer }: CustommerCardProps) => {
    const [open] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    customer;
    return (
      <div
        className={clsx(
          "w-[fit-content] w-[fit-contenth",
          open && "z-100 bg-zinc-800/30 "
        )}
      >
        <motion.div
          ref={ref}
          className={clsx(
            "flex flex-col p-2 bg-white rounded-md shadow-md flex-shrink-0 flex-grow-0",
            open && ""
          )}
          animate={{ width: open ? 600 : 200, height: open ? 600 : 200 }}
        >
          <div className="flex items-center justify-between">
            <motion.h2>{customer.customerName}</motion.h2>
            <IconButton>
              <Maximize2 className="w-5 h-5" />
            </IconButton>
          </div>
          <div></div>
        </motion.div>
      </div>
    );
  }
);
