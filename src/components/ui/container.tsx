import clsx from "clsx";
import React from "react";

type ContainerProps = React.ComponentPropsWithoutRef<"div">;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("sm:px-8 h-screen snap-center", className)}
        {...props}
      >
        <div className="h-full mx-auto max-x-7xl py-2 lg:px-8  flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    );
  }
);
