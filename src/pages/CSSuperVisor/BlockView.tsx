import { Container } from "@/components/ui/container";
import "./BlockView.css";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { CustomerInfo, generateCSs } from "@/TestData/fakeData";
import { CsStatusId, allStatusId, csStatusMap } from "@/lib/status";
import React, { useEffect } from "react";
import { useDiffCustomerServiceList } from "@/components/providers/allCustomers";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CustommerCardSimple } from "../CustomerCard/customerCardSimple";

export const BlockView = () => {
  const { setCustomerListFrom, setCustomerListTo } =
    useDiffCustomerServiceList();
  const [customerLists, setCustomerLists] = React.useState<
    Record<CsStatusId, CustomerInfo[]>
  >({
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": [],
  });

  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const testData = await generateCSs();

      const customerFrom: CustomerInfo[] = [];

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
      setCustomerLists(customersLists);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnd = (result: DropResult) => {
    console.log(result);

    try {
      const { source, destination } = result;
      if (!destination) return;

      const sourceStatus = source.droppableId as CsStatusId;
      const destinationStatus = destination.droppableId as CsStatusId;
      if (sourceStatus === destinationStatus) return;
      const newSrcList = [...customerLists[sourceStatus]];
      const newDestList = [...customerLists[destinationStatus]];

      const [removed] = newSrcList.splice(source.index, 1);

      if (
        newDestList.findIndex(
          (item) => item.customerID === removed.customerID
        ) !== -1
      )
        return;
      newDestList.splice(destination.index, 0, {
        ...removed,
        status: destinationStatus,
      });

      const newCustomerLists = { ...customerLists };

      newCustomerLists[sourceStatus] = newSrcList;
      newCustomerLists[destinationStatus] = newDestList;

      setCustomerLists(newCustomerLists);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  useEffect(() => {
    const customerTo: CustomerInfo[] = [];
    allStatusId.forEach((statusId) => {
      customerLists[statusId].forEach((customer) => {
        customerTo.push(customer);
      });
    });
    setCustomerListTo(customerTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerLists]);
  return (
    <Container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-6 gap-4 -mb-12 h-[90vh] w-[90vw] overflow-auto">
          {allStatusId.map((statusId) => {
            return (
              <Droppable key={statusId} droppableId={statusId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="customer-block-col hidescrollbar"
                  >
                    <div className="w-full flex my-2">
                      <h1 className="font-bold text-lg text-indigo-900/90">
                        {t(csStatusMap[statusId])}
                      </h1>
                    </div>
                    {customerLists[statusId].map((customer, index) => {
                      return (
                        <CustommerCardSimple
                          customer={customer}
                          index={index}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </Container>
  );
};
