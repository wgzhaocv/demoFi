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
import {
  AnimatePresence,
  motion,
  transform,
  useWillChange,
} from "framer-motion";
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
  DraggableStateSnapshot,
  DraggingStyle,
  DropResult,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { toast } from "sonner";
import { Collapse } from "@/components/ui/collapse";
import {
  CustomerInfo,
  CustomerService,
  CustomerSubaccount,
  generateCSs,
} from "@/TestData/fakeData";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Link as LinkRrd,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useCustomerServiceList } from "@/components/providers/CSList";
import { DiffDialog } from "./diffDialog";
import { useDiffCustomerServiceList } from "@/components/providers/allCustomers";
import { useDispItems } from "@/components/providers/DispItems";

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

  return (
    <motion.div className="flex flex-col" layoutRoot>
      <div className="cs-row w-full justify-center sticky top-0 bg-white text-lg z-30">
        <Text size={"4"} weight={"bold"}>
          {t("Customer Service List")}
        </Text>
      </div>
      <CustomerServiceRow asTitle cols={cols} setCols={setCols} />
      <Droppable droppableId={"CustomerServiceList"}>
        {(provided, snapshot) => (
          <motion.div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx("flex flex-col w-full")}
          >
            {customerGroup.map((group, index) => (
              <CustomerServiceGroup
                key={group.customerService}
                customerService={group.customerService}
                customers={group.customers}
                cols={cols}
                i={index}
              />
            ))}
            {provided.placeholder}
          </motion.div>
        )}
      </Droppable>
    </motion.div>
  );
};

type CustomerServiceGroupProps = {
  customerService: string;
  customers: CustomerInfo[];
  cols: ColsAttr[];
  i: number;
};
type ColsAttr = { name: ItemName; deletable: boolean; link: boolean };
export type CustomeListColsAttr = {
  name: CustomerListItemName;
  deletable: boolean;
  link: boolean;
};
const CustomerServiceGroup = ({
  customerService,
  customers,
  cols,
  i,
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
    <Draggable draggableId={customerService} index={i} isDragDisabled>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={clsx("w-full flex flex-col")}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
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
        </div>
      )}
    </Draggable>
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
      <motion.div
        className="cs-row bg-pink-200 sticky top-[45px] z-30"
        layoutRoot
      >
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
                  <Link asChild>
                    <LinkRrd
                      to={`?customerService=${props.csName}#customerReview`}
                    >
                      <Text className="break-all">{props.csName}</Text>
                    </LinkRrd>
                  </Link>
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
              ) : col.link ? (
                <Link asChild>
                  <LinkRrd
                    to={`?customer=${props.cutomer.customerID}#customerReview`}
                  >
                    <Text>{props.cutomer[col.name]}</Text>
                  </LinkRrd>
                </Link>
              ) : (
                <Text>{props.cutomer[col.name]}</Text>
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
  selectedCustomers: CustomerInfo[];
  setSelectedCustomers: React.Dispatch<React.SetStateAction<CustomerInfo[]>>;
};

const CustomerList = React.memo(
  ({
    customers,
    selectedCustomers,
    setSelectedCustomers,
  }: CustomerListProps) => {
    const [allStatusTabs, setAllStatusTabs] =
      React.useState<CsStatusId[]>(allStatusId);
    const [selectedStatus, setSelectedStatus] = React.useState<CsStatusId>(
      allStatusId[0]
    );

    const cols = useDispItems((state) => state.displayList);

    const handleCustomerClick = React.useCallback((customer: CustomerInfo) => {
      return (e: React.MouseEvent) => {
        if (e.ctrlKey || e.metaKey) {
          setSelectedCustomers((pre) => {
            if (pre.includes(customer))
              return pre.filter((c) => c !== customer);
            return [...pre, customer];
          });
        } else {
          setSelectedCustomers((pre) => {
            if (pre.includes(customer)) return [];
            return [customer];
          });
        }
      };
    }, []);

    const { t } = useTranslation();
    return (
      <div className="w-[fit-content]">
        <div className="cs-row w-full justify-center sticky top-0 bg-white text-lg z-30">
          <Text size={"4"} weight={"bold"}>
            {t("Customer Service List")}
          </Text>
        </div>

        <ul className="cs-row sticky top-[45px] bg-white z-30">
          <AnimatePresence>
            {allStatusTabs.map((status) => (
              <Droppable droppableId={"status:" + status} key={status}>
                {(provided, snapshot) => (
                  <motion.li
                    style={{ width: 150 }}
                    exit={{ width: 0 }}
                    className={clsx(
                      "cs-cell overflow-visible",
                      snapshot.isDraggingOver && "bg-pink-300/10"
                    )}
                    ref={provided.innerRef}
                    onClick={() => setSelectedStatus(status)}
                    {...provided.droppableProps}
                  >
                    <div
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
                      <span className="hidden">{provided.placeholder}</span>
                    </div>
                  </motion.li>
                )}
              </Droppable>
            ))}
          </AnimatePresence>
        </ul>
        <CustomerRow asTitle cols={cols} />
        <Droppable droppableId={"CustomerList"}>
          {(provided, snapshot) => (
            <motion.div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={clsx("flex flex-col w-full")}
            >
              {customers[selectedStatus].map((customer, i) => (
                <CustomerRow
                  key={customer.customerID}
                  customer={customer}
                  cols={cols}
                  index={i}
                  handleCustomerClick={handleCustomerClick}
                  selected={selectedCustomers.includes(customer)}
                />
              ))}
              {provided.placeholder}
            </motion.div>
          )}
        </Droppable>
      </div>
    );
  }
);

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
    }
  | {
      customer: CustomerInfo;
      cols: CustomeListColsAttr[];
      index: number;
      selected?: boolean;
      handleCustomerClick: (
        customer: CustomerInfo
      ) => (e: React.MouseEvent) => void;
    };
const CustomerRow = React.memo((props: CustomerRowprops) => {
  const { customerListItemWidth } = useCustomerListItemWStore();
  const hide = useDispItems((state) => state.hide);
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
                        onClick={() => hide([col.name])}
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

  const row = React.useMemo(() => {
    const hasReview =
      props.customer.review.reviwA ||
      props.customer.review.reviwB ||
      props.customer.review.reviwC ||
      props.customer.review.reviwD ||
      props.customer.review.reviwE;
    const reviews = [
      props.customer.review.reviwA,
      props.customer.review.reviwB,
      props.customer.review.reviwC,
      props.customer.review.reviwD,
      props.customer.review.reviwE,
    ];
    const kana = ["あ", "い", "う", "え", "お"];

    return (
      <motion.div
        className={clsx("w-full cs-row", props.selected && "bg-pink-300/10")}
        onClick={props.handleCustomerClick(props.customer)}
        layoutRoot
      >
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
                {col.name === "customerName" ? (
                  hasReview ? (
                    <div className="w-full h-full flex flex-col items-start justify-between">
                      <Link asChild>
                        <LinkRrd
                          to={`?customer=${props.customer.customerID}#customerReview`}
                        >
                          <Text>{props.customer[col.name]}</Text>
                        </LinkRrd>
                      </Link>
                      <div className="w-full flex justify-around flex-nowrap">
                        {reviews.map((review, i) => (
                          <HoverCard key={i} openDelay={100}>
                            <HoverCardTrigger>
                              {review ? (
                                <LinkRrd
                                  to={`?customer=${props.customer.customerID}#customerReview`}
                                >
                                  <Link asChild>
                                    <span
                                      key={i}
                                      className={clsx(
                                        "text-xs text-zinc-600 font-semibold"
                                      )}
                                    >
                                      {kana[i]}
                                    </span>
                                  </Link>
                                </LinkRrd>
                              ) : (
                                <span
                                  key={i}
                                  className={clsx(
                                    "text-xs text-zinc-600 font-semibold"
                                  )}
                                >
                                  {kana[i]}
                                </span>
                              )}
                            </HoverCardTrigger>
                            {review && (
                              <HoverCardContent>{review}</HoverCardContent>
                            )}
                          </HoverCard>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link asChild>
                      <LinkRrd
                        to={`?customer=${props.customer.customerID}#customerReview`}
                      >
                        <Text>{props.customer[col.name]}</Text>
                      </LinkRrd>
                    </Link>
                  )
                ) : (
                  <OptionLink isLink={col.link}>
                    <Text>{props.customer[col.name]}</Text>
                  </OptionLink>
                )}
              </motion.div>
            </React.Fragment>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  }, [
    props.cols,
    props.customer,
    customerListItemWidth,
    handleOpenDetail,
    props.selected,
    props.handleCustomerClick,
  ]);

  const getStyle = (
    snapshot: DraggableStateSnapshot,
    style?: DraggingStyle | NotDraggingStyle
  ) => {
    const isDragging = snapshot.isDragging;
    const cursor = isDragging ? "grabbing" : "default";
    if (!snapshot.isDropAnimating) {
      return { ...style, cursor };
    }
    const hoveringId = snapshot.draggingOver;
    console.log(hoveringId, snapshot.dropAnimation);
    if (hoveringId?.startsWith("status:")) {
      return { ...style, transitionDuration: `0.001s`, opacity: 0, cursor };
    } else {
      return { ...style, cursor };
    }
  };

  return (
    <Draggable
      draggableId={props.customer.status + ":" + props.customer.customerID}
      index={props.index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={clsx(
            "w-full flex flex-col shrink-0 grow-0 transition-none",
            snapshot.isDragging && "opacity-50"
          )}
          style={getStyle(snapshot, provided.draggableProps.style)}
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
  const { setCustomerListFrom, setCustomerListTo } =
    useDiffCustomerServiceList();

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

      const customerFrom: CustomerInfo[] = [];

      testData.customerServices.forEach((cs) => {
        cs.customers.forEach((c) => {
          customerFrom.push(c);
        });

        cs.customerServiceHistoryInfo.customers.forEach((c) => {
          customerFrom.push(c.customer);
        });
      });

      testData.customers.forEach((c) => {
        customerFrom.push(c);
      });

      setCustomerListFrom(customerFrom);

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
    })();
  }, []);

  useEffect(() => {
    const customerTo: CustomerInfo[] = [];
    Object.entries(rightList).forEach(([_, customers]) => {
      customers.forEach((c) => {
        customerTo.push(c);
      });
    });

    leftList.forEach((cs) => {
      cs.customers.forEach((c) => {
        customerTo.push(c);
      });
      cs.customerServiceHistoryInfo.customers.forEach((c) => {
        customerTo.push(c.customer);
      });
    });

    setCustomerListTo(customerTo);
  }, [leftList, rightList]);

  const [selectedCustomers, setSelectedCustomers] = React.useState<
    CustomerInfo[]
  >([]);

  const { t } = useTranslation();

  const handleDragEnd = React.useCallback(
    (result: DropResult) => {
      console.log(result);

      try {
        const droppableId = result.destination?.droppableId as string;

        if (!result.destination) return;

        const status = result.draggableId.split(":")[0] as CsStatusId;
        const customerId = result.draggableId.split(":")[1];

        const customerList = rightList[status];
        const customer = customerList.find((c) => c.customerID === customerId);
        const customerListMove: CustomerInfo[] = [];
        if (selectedCustomers.length <= 1) {
          customerListMove.push(customer as CustomerInfo);
        } else {
          if (!selectedCustomers.includes(customer as CustomerInfo)) {
            customerListMove.push(customer as CustomerInfo);
          } else {
            customerListMove.push(...selectedCustomers);
          }
        }

        let newRightList = {
          ...rightList,
          [status]: customerList.filter((c) => !customerListMove.includes(c)),
        };

        if (droppableId.startsWith("status:")) {
          const newStatus = droppableId.split(":")[1] as CsStatusId;
          const newCustomerListMove = customerListMove.map((c) => ({
            ...c,
            status: newStatus,
          }));

          if (newStatus !== status) {
            newRightList = {
              ...newRightList,
              [newStatus]: [...newRightList[newStatus], ...newCustomerListMove],
            };
            setRightList(newRightList);
            toast.success(
              `${t("Customer is added to status")}${t(csStatusMap[newStatus])}`
            );
          }
        } else if (droppableId === "CustomerServiceList") {
          const index = result.destination.index;
          const dstIndex = index - 1;

          const customerService = leftList[dstIndex];
          if (!customerService) return;

          const newCustomerService = {
            ...customerService,
            customers: [
              ...customerService.customers,
              ...customerListMove.map((c) => ({
                ...c,
                customerService: customerService.customerService,
              })),
            ],
          };

          const newLeftList = [...leftList];
          newLeftList[dstIndex] = newCustomerService;

          setLeftList(newLeftList);
          setRightList(newRightList);

          toast.success(
            `${t("Customer is added to Service")}${
              customerService.customerService
            }`
          );
        }
        setSelectedCustomers([]);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      }
    },
    [leftList, rightList, selectedCustomers]
  );

  const location = useLocation();
  const { setCustomerInfo, setCustomerServiceHistory } =
    useCustomerServiceList();
  const customerMap = React.useMemo(() => {
    const customerLocalMap: Record<string, CustomerInfo> = {};
    leftList.forEach((cs) => {
      cs.customers.forEach((c) => {
        customerLocalMap[c.customerID] = c;
      });
    });

    Object.entries(rightList).forEach(([_, customers]) => {
      customers.forEach((c) => {
        customerLocalMap[c.customerID] = c;
      });
    });

    return customerLocalMap;
  }, [leftList, rightList]);

  const customerServiceMap = React.useMemo(() => {
    const customerServiceMap: Record<string, CustomerService> = {};
    leftList.forEach((cs) => {
      customerServiceMap[cs.customerService] = cs;
    });
    return customerServiceMap;
  }, [leftList]);

  React.useEffect(() => {
    const { hash, search } = location;
    const searchParams: Record<string, string> = {};
    if (hash === "#customerReview") {
      search
        .slice(1)
        .split("&")
        .forEach((s) => {
          const [key, value] = s.split("=");
          searchParams[key] = value;
        });
      if (searchParams.customer) {
        const customer = customerMap[searchParams.customer];
        if (customer) {
          const customerService = customerServiceMap[customer.customerService];
          if (customerService) {
            setCustomerServiceHistory(
              customerService.customerServiceHistoryInfo
            );
          }
          setCustomerInfo(customer);
        }
      } else if (searchParams.customerService) {
        const customerService =
          customerServiceMap[searchParams.customerService];
        const customer =
          customerService?.customerServiceHistoryInfo.customers[0].customer;
        if (customerService) {
          setCustomerServiceHistory(customerService.customerServiceHistoryInfo);
        }
        if (customer) setCustomerInfo(customer);
      }
    }
  }, [location, customerMap, customerServiceMap]);

  const [open, setOpen] = React.useState<-1 | 0 | 1>(0);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        className={clsx(
          "h-[80vh] rounded-lg shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/10 relative",
          "flex overflow-auto"
        )}
      >
        <DiffDialog />
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
          <CustomerList
            customers={rightList}
            selectedCustomers={selectedCustomers}
            setSelectedCustomers={setSelectedCustomers}
          />
        </motion.section>
      </div>
    </DragDropContext>
  );
});
