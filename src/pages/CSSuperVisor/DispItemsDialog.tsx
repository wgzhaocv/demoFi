import { useDispItems } from "@/components/providers/DispItems";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { useTranslation } from "react-i18next";
import { CustomeListColsAttr } from "./ListView";
import {
  BetweenVerticalEnd,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import clsx from "clsx";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";

export const DispItemDialog = () => {
  const [openDispItems, setOpenDispItems] = React.useState(false);
  const {
    displayList,
    undisplayList,
    hide,
    show,
    setDisplayList,
    setUndisplayList,
  } = useDispItems();
  const [selectedItems, setSelectedItems] = React.useState<{
    flag: 0 | 1;
    list: CustomeListColsAttr[];
  }>({ flag: 0, list: [] });

  const { t } = useTranslation();

  const showItem = () => {
    if (selectedItems.flag !== 0) return;
    show(selectedItems.list.map((item) => item.name));
    setSelectedItems({ flag: 0, list: [] });
  };
  const showItems = () => {
    show(undisplayList.map((item) => item.name));
    setSelectedItems({ flag: 0, list: [] });
  };

  const hideItem = () => {
    if (selectedItems.flag !== 1) return;
    hide(
      selectedItems.list
        .filter((item) => item.deletable)
        .map((item) => item.name)
    );
    setSelectedItems({ flag: 0, list: [] });
  };
  const hideItems = () => {
    hide(displayList.filter((item) => item.deletable).map((item) => item.name));
    setSelectedItems({ flag: 0, list: [] });
  };

  const clickLeft = (e: React.MouseEvent, item: CustomeListColsAttr) => {
    setSelectedItems((prev) => {
      if (prev.flag === 0) {
        return { flag: 1, list: [item] };
      } else {
        if (e.ctrlKey || e.metaKey) {
          return { flag: 1, list: Array.from(new Set([...prev.list, item])) };
        } else {
          return { flag: 1, list: [item] };
        }
      }
    });
  };

  const clickRight = (e: React.MouseEvent, item: CustomeListColsAttr) => {
    setSelectedItems((prev) => {
      if (prev.flag === 1) {
        return { flag: 0, list: [item] };
      } else {
        if (e.ctrlKey || e.metaKey) {
          return { flag: 0, list: Array.from(new Set([...prev.list, item])) };
        } else {
          return { flag: 0, list: [item] };
        }
      }
    });
  };

  const handleDragEnd: OnDragEndResponder = (result) => {
    console.log(result);

    const index = selectedItems.list.findIndex(
      (item) => item.name === result.draggableId
    );
    const srcDroppableId = result.source.droppableId;
    const dstDroppableId = result.destination?.droppableId;
    if (index === -1) {
      if (srcDroppableId === dstDroppableId) {
        if (srcDroppableId === "left") {
          const fromIndex = result.source.index;
          const toIndex = result.destination?.index as number;
          const newDisplayList = [...displayList];

          const item = newDisplayList.splice(fromIndex, 1)[0];
          newDisplayList.splice(toIndex, 0, item);
          setDisplayList(newDisplayList);
        } else if (srcDroppableId === "right") {
          const fromIndex = result.source.index;
          const toIndex = result.destination?.index as number;
          const newUndisplayList = [...undisplayList];

          const item = newUndisplayList.splice(fromIndex, 1)[0];
          newUndisplayList.splice(toIndex, 0, item);
          setUndisplayList(newUndisplayList);
        }
      } else {
        if (srcDroppableId === "left") {
          const fromIndex = result.source.index;
          const toIndex = result.destination?.index as number;
          const newDisplayList = [...displayList];
          const newUndisplayList = [...undisplayList];

          const item = newDisplayList.splice(fromIndex, 1)[0];
          newUndisplayList.splice(toIndex, 0, item);
          setDisplayList(newDisplayList);
          setUndisplayList(newUndisplayList);
        } else if (srcDroppableId === "right") {
          const fromIndex = result.source.index;
          const toIndex = result.destination?.index as number;
          const newDisplayList = [...displayList];
          const newUndisplayList = [...undisplayList];

          const item = newUndisplayList.splice(fromIndex, 1)[0];
          newDisplayList.splice(toIndex, 0, item);
          setDisplayList(newDisplayList);
          setUndisplayList(newUndisplayList);
        }
      }
    } else {
      //
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Dialog open={openDispItems} onOpenChange={setOpenDispItems}>
        <DialogTrigger asChild>
          <Button variant={"outline"} className="fixed left-40 top-5 z-40">
            <BetweenVerticalEnd className="w-5 h-5 mr-2" />
            {t("dispItems")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Select Display Items")}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 select-none">
            <Droppable droppableId="left">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-40 h-80 overflow-auto flex border border-zinc-800/30 rounded-lg flex-col px-2 flex-grow-0 flex-shrink-0"
                >
                  {displayList.map((item, i) => (
                    <Draggable
                      key={item.name}
                      draggableId={item.name}
                      index={i}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          tabIndex={0}
                          className={clsx(
                            "p-1 my-1 text-lg cursor-default text-zinc-800",
                            selectedItems.flag === 1 &&
                              selectedItems.list.includes(item) &&
                              "bg-indigo-300/30",
                            snapshot.isDragging && "opacity-50"
                          )}
                          onClick={(e) => clickLeft(e, item)}
                        >
                          {t(item.name)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="flex flex-col items-center justify-center">
              <div className="flex gap-12 flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <Button
                    variant={"outline"}
                    className="p-0"
                    onClick={showItems}
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button variant={"outline"} onClick={showItem}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant={"outline"} onClick={hideItem}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant={"outline"} onClick={hideItems}>
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Droppable droppableId="right">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-40 h-80 overflow-auto flex border border-zinc-800/30 rounded-lg flex-col px-2 flex-grow-0 flex-shrink-0"
                >
                  {undisplayList.map((item, i) => (
                    <Draggable
                      key={item.name}
                      draggableId={item.name}
                      index={i}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          tabIndex={0}
                          className={clsx(
                            "p-1 my-1 text-lg cursor-default text-zinc-800",
                            selectedItems.flag === 0 &&
                              selectedItems.list.includes(item) &&
                              "bg-indigo-300/30",
                            snapshot.isDragging && "opacity-50"
                          )}
                          onClick={(e) => clickRight(e, item)}
                        >
                          {t(item.name)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <DialogFooter>
            <Button
              variant={"default"}
              onClick={() => setOpenDispItems(false)}
              className="flex items-center justify-center"
            >
              {t("Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DragDropContext>
  );
};
