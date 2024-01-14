import clsx from "clsx";
import React from "react";

type ContainerProps = React.ComponentPropsWithoutRef<"div">;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx("sm:px-8", className)} {...props}>
        <div className="mx-auto max-x-7xl py-2 lg:px-8">{children}</div>
      </div>
    );
  }
);
