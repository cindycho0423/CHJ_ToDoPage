import clsx from "clsx";

import type { TodoStatus } from "@/types/todo";

interface BadgeProps {
  status: TodoStatus;
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      className={clsx(
        "h-16 rounded-md px-4 py-2 text-8",
        {
          TODO: "bg-red-100 text-red-600",
          ON_PROGRESS: "bg-blue-100 text-blue-600",
          DONE: "bg-green-100 text-green-600",
        }[status],
      )}
    >
      {status}
    </span>
  );
}
