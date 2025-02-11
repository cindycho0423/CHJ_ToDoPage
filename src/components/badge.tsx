import clsx from "clsx";

import type { TaskStatus } from "@/types/task";

interface BadgeProps {
  status: TaskStatus;
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      className={clsx(
        "rounded-md px-4 py-2 text-12",
        {
          todo: "bg-red-100 text-red-600",
          onProgress: "bg-green-100 text-green-600",
          done: "bg-blue-100 text-blue-600",
        }[status],
      )}
    >
      {status}
    </span>
  );
}
