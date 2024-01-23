/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useTransition } from "react";
import clsx from "clsx";
import {
  ChevronDown,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  DeleteIcon,
  Plus,
  XCircle,
} from "lucide-react";
import "./tablecss.css";
import { useTranslation } from "react-i18next";
import testData from "@/TestData/CSSuperVisor.json";
import { CsStatusId, allStatusId, csStatusMap } from "@/lib/status";
import { AnimatePresence, motion, useWillChange } from "framer-motion";
import {
  CustomerListItemName,
  ItemName,
  useCSItemWStore,
  useCustomerListItemWStore,
} from "@/components/providers/CSItemsWidthProvider";
import { IconButton, Link, Text, Tooltip } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { toast } from "sonner";
import { Collapse } from "@/components/ui/collapse";
import {
  CustomerInfo,
  CustomerService,
  CustomerSubaccount,
  generateCSs,
} from "@/TestData/fakeData";

type CustomerServiceListProps = {
  groupedCustomers: CustomerService[];
};

const CustomerServiceList = ({
  groupedCustomers,
}: CustomerServiceListProps) => {
  const { t } = useTranslation();
  const [cols, setCols] = React.useState<ColsAttr[]>([
    { name: "customerService", deletable: false, link: false },
    { name: "customerName", deletable: false, link: true },
    { name: "customerID", deletable: true, link: true },
    { name: "mailAddress", deletable: false, link: false },
    { name: "telephone", deletable: false, link: false },
    { name: "status", deletable: false, link: false },
  ]);

  const [customerGroup, setCustomerGroup] =
    React.useState<CustomerService[]>(groupedCustomers);

  useEffect(() => setCustomerGroup(groupedCustomers), [groupedCustomers]);

  console.log(">>>>customerGroup", customerGroup[0]);

  return (
    <motion.div className="flex flex-col" layoutRoot>
      <div className="cs-row w-full justify-center sticky top-0 bg-white text-lg z-30">
        <Text size={"4"} weight={"bold"}>
          {t("Customer Service List")}
        </Text>
      </div>
      <CustomerServiceRow asTitle cols={cols} setCols={setCols} />
      {customerGroup.map((group) => (
        <CustomerServiceGroup
          key={group.customerService}
          customerService={group.customerService}
          customers={group.customers}
          cols={cols}
        />
      ))}
    </motion.div>
  );
};

type CustomerServiceGroupProps = {
  customerService: string;
  customers: CustomerInfo[];
  cols: ColsAttr[];
};
type ColsAttr = { name: ItemName; deletable: boolean; link: boolean };
type CustomeListColsAttr = {
  name: CustomerListItemName;
  deletable: boolean;
  link: boolean;
};
const CustomerServiceGroup = ({
  customerService,
  customers,
  cols,
}: CustomerServiceGroupProps) => {
  const [open, setOpen] = React.useState(true);
  const ref = React.useRef<HTMLDivElement>(null);
  const [firstCustomer, ...restCustomers] = customers;
  useEffect(() => {
    if (ref.current) {
      if (open) {
        ref.current.style.maxHeight = ref.current.scrollHeight + "px";
      } else {
        ref.current.style.maxHeight = "0";
      }
    }
  }, [open, restCustomers.length]);

  return (
    <Droppable droppableId={customerService}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={clsx("w-full flex flex-col")}
          //   style={{ backgroundColor: snapshot.isDraggingOver ? "blue" : "#fff" }}
          {...provided.droppableProps}
        >
          <CustomerServiceRow
            cutomer={firstCustomer}
            csName={customerService}
            cols={cols}
            setOpen={setOpen}
            open={open}
          />
          <div
            ref={ref}
            className="flex flex-col overflow-hidden transition-[max-height] duration-200 ease-out"
          >
            {restCustomers.map((customer) => (
              <CustomerServiceRow
                key={customer.customerID}
                cutomer={customer}
                cols={cols}
                setOpen={setOpen}
              />
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

type OptionLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  children: React.ReactNode;
  isLink?: boolean;
  href?: string;
};

const OptionLink = React.memo(
  ({ isLink = false, children, href = "/" }: OptionLinkProps) => {
    return isLink ? (
      <Link href={href} target="_blank">
        {children}
      </Link>
    ) : (
      <>{children}</>
    );
  }
);

type CustomerServiceRowProps =
  | {
      asTitle: boolean;
      cols: ColsAttr[];
      setCols: React.Dispatch<React.SetStateAction<ColsAttr[]>>;
    }
  | {
      cutomer: CustomerInfo;
      csName?: string;
      cols: ColsAttr[];
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
      open?: boolean;
    };

const CustomerServiceRow = React.memo((props: CustomerServiceRowProps) => {
  const { t } = useTranslation();
  const { itemWidth } = useCSItemWStore();

  if ("asTitle" in props) {
    return (
      <motion.div className="cs-row bg-pink-200 sticky top-[45px] z-30" layoutRoot>
        <AnimatePresence>
          {props.cols.map((col, i) => (
            <React.Fragment key={col.name}>
              <motion.div
                layout
                style={{ width: itemWidth[col.name] }}
                exit={{ width: 0 }}
                className="cs-cell"
              >
                {i !== 0 && <Text>{t(col.name)}</Text>}
                {col.deletable && (
                  <div className="ml-2 flex item-center justify-center">
                    <IconButton
                      variant="ghost"
                      radius="full"
                      size={"1"}
                      onClick={() =>
                        props.setCols((cols) => cols.filter((c) => c !== col))
                      }
                    >
                      <XCircle className="w-4 h-4" />
                    </IconButton>
                  </div>
                )}
              </motion.div>
            </React.Fragment>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  }

  const collapse = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      props?.setOpen((pre) => {
        return !pre;
      });
    },
    [props.setOpen]
  );

  return (
    <motion.div className={"cs-row"} layoutRoot>
      <AnimatePresence>
        {props.cols.map((col, i) => (
          <React.Fragment key={col.name}>
            <motion.div
              layout
              style={{ width: itemWidth[col.name] }}
              exit={{ width: 0 }}
              className="cs-cell text-wrap leading-4 relative first:pr-6"
            >
              {i === 0 ? (
                <>
                  <Text className="break-all">{props.csName}</Text>
                  {props.csName && (
                    <motion.div
                      className="ml-2 flex items-center absolute right-1 top-[50%] translateTocenter"
                      animate={{
                        rotate: props.open === false ? "180deg" : "0",
                      }}
                      transition={{ type: "just" }}
                    >
                      <IconButton
                        className="transition-transform flex items-center justify-center"
                        onClick={collapse}
                        variant="ghost"
                        radius="full"
                        size={"1"}
                      >
                        <span>
                          <ChevronDown className="w-3 h-3" />
                        </span>
                      </IconButton>
                    </motion.div>
                  )}
                </>
              ) : col.name === "status" ? (
                <Tooltip
                  content={t(
                    csStatusMap[props.cutomer[col.name] as CsStatusId]
                  )}
                >
                  <Text>
                    {t(csStatusMap[props.cutomer[col.name] as CsStatusId])}
                  </Text>
                </Tooltip>
              ) : (
                <OptionLink isLink={col.link}>
                  <Text>{props.cutomer[col.name]}</Text>
                </OptionLink>
              )}
            </motion.div>
          </React.Fragment>
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

type CustomerListProps = {
  customers: Record<CsStatusId, CustomerInfo[]>;
};

const CustomerList = React.memo(({ customers }: CustomerListProps) => {
  const [allStatusTabs, setAllStatusTabs] =
    React.useState<CsStatusId[]>(allStatusId);
  const [selectedStatus, setSelectedStatus] = React.useState<CsStatusId>(
    allStatusId[0]
  );

  const [cols, setCols] = React.useState<CustomeListColsAttr[]>([
    { name: "customerName", deletable: false, link: true },
    { name: "customerID", deletable: true, link: true },
    { name: "mailAddress", deletable: false, link: false },
    { name: "telephone", deletable: false, link: false },
    { name: "address", deletable: false, link: false },
  ]);

  const { t } = useTranslation();
  return (
    <Droppable droppableId={"CustomerList"}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={{ backgroundColor: snapshot.isDraggingOver ? "blue" : "#fff" }}
          {...provided.droppableProps}
          className="w-[fit-content]"
        >
          <div className="cs-row w-full justify-center sticky top-0 bg-white text-lg z-30">
            <Text size={"4"} weight={"bold"}>
              {t("Customer Service List")}
            </Text>
          </div>
          <ul className="cs-row sticky top-[45px] bg-white z-30">
            <AnimatePresence>
              {allStatusTabs.map((status) => (
                <motion.li
                  key={status}
                  style={{ width: 150 }}
                  exit={{ width: 0 }}
                  className="cs-cell overflow-visible"
                >
                  <div
                    onClick={() => setSelectedStatus(status)}
                    className={clsx(
                      "w-full h-full rounded-lg relative text-wrap text-center text-zinc-800 flex items-center leading-4 px-2 hover:bg-pink-300/10"
                    )}
                  >
                    {selectedStatus === status && (
                      <motion.div
                        layoutId="statusTabBg"
                        className={
                          "absolute inset-0 selected-status pointer-events-none z-[-1]"
                        }
                      />
                    )}
                    {t(csStatusMap[status])}
                    <div className="ml-2 flex items-center justify-center">
                      <IconButton
                        variant="ghost"
                        radius="full"
                        size={"1"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAllStatusTabs((tabs) =>
                            tabs.filter((t) => t !== status)
                          );
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <CustomerRow asTitle cols={cols} setCols={setCols} />
          <motion.div className=" flex flex-col w-full">
            {customers[selectedStatus].map((customer, i) => (
              <CustomerRow
                key={customer.customerID}
                customer={customer}
                cols={cols}
                index={i}
              />
            ))}
          </motion.div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

type CustomerDetailRowProps = {
  subacount: CustomerSubaccount[0] | CustomerSubaccount[1];
  cols: CustomeListColsAttr[];
};

const CustomerDetailRow = React.memo((props: CustomerDetailRowProps) => {
  const { customerListItemWidth } = useCustomerListItemWStore();
  return (
    <motion.div className="cs-row w-full" layoutRoot>
      <AnimatePresence>
        {props.cols.map((col, i) => (
          <React.Fragment key={col.name}>
            <motion.div
              layout
              style={{ width: customerListItemWidth[col.name] }}
              exit={{ width: 0 }}
              className="cs-cell text-wrap leading-4"
            >
              {i === 1 && (
                <OptionLink isLink={col.link}>
                  <Text>
                    {props.subacount.customerID}{" "}
                    {"FXID" in props.subacount && props.subacount.FXID}
                    {"BOID" in props.subacount && props.subacount.BOID}
                  </Text>
                </OptionLink>
              )}
              {i === 2 &&
                (("FXStatus" in props.subacount &&
                  props.subacount.FXStatus === 1) ||
                ("BOStatus" in props.subacount &&
                  props.subacount.BOStatus === 1) ? (
                  <>◎未申請</>
                ) : (
                  <>〇未申請</>
                ))}
              {i === 3 &&
                (("FXStatus" in props.subacount &&
                  props.subacount.FXStatus === 2) ||
                ("BOStatus" in props.subacount &&
                  props.subacount.BOStatus === 2) ? (
                  <>◎申し込み</>
                ) : (
                  <>〇申し込み</>
                ))}
              {i === 4 &&
                (("FXStatus" in props.subacount &&
                  props.subacount.FXStatus === 3) ||
                ("BOStatus" in props.subacount &&
                  props.subacount.BOStatus === 3) ? (
                  <>◎申請完了</>
                ) : (
                  <>〇申請完了</>
                ))}
            </motion.div>
          </React.Fragment>
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

type CustomerRowprops =
  | {
      asTitle: boolean;
      cols: CustomeListColsAttr[];
      setCols: React.Dispatch<React.SetStateAction<CustomeListColsAttr[]>>;
    }
  | {
      customer: CustomerInfo;
      cols: CustomeListColsAttr[];
      index: number;
    };
const CustomerRow = React.memo((props: CustomerRowprops) => {
  const { customerListItemWidth } = useCustomerListItemWStore();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  if ("asTitle" in props) {
    return (
      <motion.div
        className="w-full cs-row bg-pink-200 sticky top-[90px] z-30"
        layoutRoot
      >
        <AnimatePresence>
          {props.cols.map((col) => (
            <React.Fragment key={col.name}>
              <motion.div
                layout
                style={{
                  width: customerListItemWidth[col.name],
                }}
                exit={{ width: 0 }}
                className="cs-cell flex justify-center items-center"
              >
                <div className="w-full flex justify-start items-center ">
                  <Text>{t(col.name)}</Text>
                  {col.deletable && (
                    <div className="ml-2 flex item-center justify-center">
                      <IconButton
                        variant="ghost"
                        radius="full"
                        size={"1"}
                        onClick={() =>
                          props.setCols((cols) => cols.filter((c) => c !== col))
                        }
                      >
                        <XCircle className="w-4 h-4" />
                      </IconButton>
                    </div>
                  )}
                </div>
                {col.name === "customerName" && (
                  <div className="w-full flex justify-between text-sm">{}</div>
                )}
              </motion.div>
            </React.Fragment>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  }
  const handleOpenDetail = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const ele = e.currentTarget as HTMLElement;
    setOpen((pre) => {
      if (!pre) {
        ele && ele.classList.add("rotate-[45deg]");
      } else {
        ele && ele.classList.remove("rotate-[45deg]");
      }
      return !pre;
    });
  }, []);

  const row = React.useMemo(
    () => (
      <motion.div className="w-full cs-row" layoutRoot>
        <AnimatePresence>
          {props.cols.map((col) => (
            <React.Fragment key={col.name}>
              <motion.div
                layout
                style={{ width: customerListItemWidth[col.name] }}
                exit={{ width: 0 }}
                className="cs-cell text-wrap leading-4"
              >
                {col.name === "customerID" && (
                  <div
                    className="mr-2 transition-transform ease-in-out duration-200 origin-center flex items-center justify-center"
                    onClick={handleOpenDetail}
                  >
                    <IconButton variant="ghost" radius="full" size={"1"}>
                      <Plus className="w-3 h-3" />
                    </IconButton>
                  </div>
                )}
                <OptionLink isLink={col.link}>
                  <Text>{props.customer[col.name]}</Text>
                </OptionLink>
              </motion.div>
            </React.Fragment>
          ))}
        </AnimatePresence>
      </motion.div>
    ),
    [props.cols, props.customer, customerListItemWidth, handleOpenDetail]
  );

  return (
    <Draggable
      draggableId={props.customer.status + ":" + props.customer.customerID}
      index={props.index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className="w-full flex flex-col shrink-0 grow-0"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {row}
          <motion.div
            animate={{ maxHeight: open ? 90 : 0 }}
            className="w-full flex flex-col overflow-hidden justify-start items-start"
          >
            {props.customer.subaccounts.map((subaccount, i) => (
              <CustomerDetailRow
                key={subaccount.customerID + i}
                cols={props.cols}
                subacount={subaccount}
              />
            ))}
          </motion.div>
        </div>
      )}
    </Draggable>
  );
});

type CSListViewProps = {};
export const CSListView = React.memo(({}: CSListViewProps) => {
  const [leftList, setLeftList] = React.useState<CustomerService[]>([]);

  const [rightList, setRightList] = React.useState<
    Record<CsStatusId, CustomerInfo[]>
  >({
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": [],
  });

  useEffect(() => {
    (async () => {
      const testData = await generateCSs();
      setLeftList(testData.customerServices);
      const customersLists = testData.customers.reduce(
        (pre, cur) => {
          pre[cur.status as CsStatusId].push(cur);
          return pre;
        },
        {
          "1": [],
          "2": [],
          "3": [],
          "4": [],
          "5": [],
          "6": [],
        } as Record<CsStatusId, CustomerInfo[]>
      );
      setRightList(customersLists);
      console.log(testData.customerServices, customersLists);
    })();
  }, []);

  const handleDragEnd = React.useCallback(
    (result: DropResult) => {
      console.log(result);

      try {
        const customerServiceId = result.destination?.droppableId as string;

        if (!result.destination) return;
        if (result.destination.droppableId === "CustomerList") {
          toast.error("Can't move to customer service");
          return;
        }

        const csList = leftList.filter(
          (c) => c.customerService === customerServiceId
        );
        if (csList.length === 5) {
          toast.error("Customer Service List is full");
          return;
        }

        const [status, _] = result.draggableId.split(":") as [
          CsStatusId,
          string
        ];
        const customerIndex = result.source.index;
        //   console.log(result, rightList[status], leftList, rightList);

        //   const newCustomerArray = Array.from(rightList[status]);
        //   const customer = newCustomerArray.splice(customerIndex, 1)[0];
        //   setLeftList((pre) => [
        //     ...pre,
        //     { ...customer, customerService: customerServiceId },
        //   ]);
        //   setRightList((pre) => ({
        //     ...pre,
        //     [status]: newCustomerArray,
        //   }));

        //   toast.success(
        //     `Customer ${customer.customerName} is added to Service ${customerServiceId}`
        //   );
      } catch (error) {
        console.log(error);
        if (error instanceof Error) toast.error(error.message);
      }
    },
    [leftList, rightList]
  );

  //   console.log(sortedLeftList);

  const [open, setOpen] = React.useState<-1 | 0 | 1>(0);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        className={clsx(
          "h-[80vh] rounded-lg shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/10 relative",
          "flex overflow-auto"
        )}
      >
        <motion.section className="h-full overflow-auto flex-shrink-0">
          <div className="">
            <CustomerServiceList groupedCustomers={leftList} />
          </div>
        </motion.section>
        <section className="h-full flex flex-col justify-center gap-48 bg-zinc-400/30 sticky top-0">
          <Button variant="ghost" className="mx-auto p-0 h-[fit-content]">
            <ChevronsLeft className="w-5 h-5 mx-auto text-zinc-900/50" />
          </Button>
          <Button variant="ghost" className="mx-auto p-0 h-[fit-content]">
            <ChevronsRight className="w-5 h-5 mx-auto text-zinc-900/50" />
          </Button>
        </section>
        <motion.section className="h-full overflow-auto">
          <CustomerList customers={rightList} />
        </motion.section>
      </div>
    </DragDropContext>
  );
});
