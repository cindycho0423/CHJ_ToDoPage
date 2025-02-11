import type { TaskStatus } from "@/types/task";

import Badge from "./badge";

interface CardProps {
  // id: string;
  title: string;
  content: string;
  status: TaskStatus;
  dueDate: string;
}

export default function Card({
  // id,
  title,
  content,
  status,
  dueDate,
}: CardProps) {
  return (
    <div className="my-12 flex min-h-180 flex-col rounded-4 border border-solid bg-white/15 p-16">
      <div>
        <span className="mr-12 text-24 font-semibold">{title}</span>
        <Badge status={status} />
      </div>
      <div className="overflow-auto">{content}</div>
      <span className="mt-auto inline-block text-right text-14">
        마감일: {dueDate}
      </span>
    </div>
  );
}
