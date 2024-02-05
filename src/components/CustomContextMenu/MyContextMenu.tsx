import React from "react";

import { customerContextMenuList } from "./customerContex";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import clsx from "clsx";
import { useCustomContextMenu } from "../providers/CustomerContextMenuProvider";

type CustomerContextMenuProps = {
  children: React.ReactNode;
};

export const CustomerContextMenuProvider = ({
  children,
}: CustomerContextMenuProps) => {
  const position = useCustomContextMenu((state) => state.position);
  const customer = useCustomContextMenu((state) => state.customer);
  const clearData = useCustomContextMenu((state) => state.clearData);
  const ref = React.useRef<HTMLDivElement>(null);

  const memoizedChildren = React.useMemo(() => children, [children]);

  return (
    <>
      {memoizedChildren}
      <DropdownMenu open={!!position && !!customer}>
        <DropdownMenuTrigger asChild>
          <div
            ref={ref}
            className="fixed w-[1px] h-[1px] bg-transparent z-50 pointer-events-none"
            style={
              position
                ? { top: position.y, left: position.x }
                : { display: "none" }
            }
          ></div>
        </DropdownMenuTrigger>
        {!!position && !!customer && (
          <DropdownMenuContent
            onEscapeKeyDown={() => {
              clearData();
            }}
            onPointerDownOutside={() => {
              clearData();
            }}
            style={{
              animation: "none",
            }}
          >
            <DropdownMenuLabel>
              {customer?.customerName || "Customer"}
            </DropdownMenuLabel>
            {customerContextMenuList.map((customermenu) => {
              if (customermenu.sub) {
                return (
                  <DropdownMenuSub key={customermenu.id}>
                    <DropdownMenuSubTrigger>
                      {customermenu.label}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {customermenu.sub.map((subitem) => {
                        return (
                          <DropdownMenuItem
                            key={subitem.id}
                            onSelect={() => {
                              customer && subitem.onClick(customer);
                              clearData();
                            }}
                          >
                            {subitem.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                );
              } else {
                return (
                  <DropdownMenuItem
                    key={customermenu.id}
                    onSelect={() => {
                      customer && customermenu.onClick(customer);
                      clearData();
                    }}
                  >
                    <span
                      className={clsx(customermenu.alert && "text-red-600")}
                    >
                      {customermenu.label}
                    </span>
                  </DropdownMenuItem>
                );
              }
            })}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </>
  );
};
