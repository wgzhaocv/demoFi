import { useMotionValue, motion } from "framer-motion";
import React, { useEffect } from "react";

type CollapseProps = React.ComponentPropsWithoutRef<typeof motion.div> & {
  open?: boolean;
  direction?: "horizontal" | "vertical";
  length?: number;
};

export const Collapse = React.memo(
  ({ open, length, direction, children, style, ...props }: CollapseProps) => {
    const maxLen = useMotionValue(length !== undefined ? length : 0);
    const ref = React.useRef<HTMLDivElement>(null);
    const isVertical = direction === "vertical";
    useEffect(() => {
      if (!ref.current || open === undefined) return;

      if (!isVertical) {
        const width = ref.current.scrollWidth;
        maxLen.set(open ? width : 0);
      } else {
        const height = ref.current.scrollHeight;
        maxLen.set(open ? height : 0);
      }
    }, [open]);

    useEffect(() => {
      if (!ref.current || length === undefined) return;
      maxLen.set(length);
    }, [length]);

    return (
      <motion.div
        ref={ref}
        style={
          isVertical
            ? { maxHeight: maxLen, ...style }
            : { maxWidth: maxLen, ...style }
        }
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
