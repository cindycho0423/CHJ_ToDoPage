import { HTMLMotionProps, motion } from "framer-motion";

import cn from "@/utils/cn";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  type: "button" | "submit";
  text?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function Button({
  type = "button",
  text,
  onClick,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      className={cn(
        "mt-12 inline-block w-full rounded-4 border border-solid px-10 py-6",
        className,
      )}
      onClick={onClick}
      whileHover={{
        scale: 0.98,
        transition: { duration: 0.3 },
      }}
      whileTap={{
        scale: 0.96,
      }}
      {...props}
    >
      {text}
      {children}
    </motion.button>
  );
}
