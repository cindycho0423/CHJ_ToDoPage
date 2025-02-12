"use client";

import { useMemo } from "react";

import Column from "@/components/column";
import { KANBAN_COLUMNS } from "@/constants/kanban";
import type { Task } from "@/types/task";

export default function Home() {
  const data: Task[] = [
    {
      id: "오늘의 할 일",
      title: "오늘의 할 일",
      content: "오늘의 할 일",
      status: "todo",
      dueDate: "2024.04.23",
    },
    {
      id: "하는 중이여",
      title: "하는 중이여",
      content: "하는 중이여",
      status: "onProgress",
      dueDate: "2024.04.21",
    },
    {
      id: "다해버렸",
      title: "다해버렸",
      content: "다해버렸",
      status: "done",
      dueDate: "2024.04.22",
    },
  ];

  const columnCards = useMemo(
    () =>
      KANBAN_COLUMNS.reduce(
        (acc, column) => {
          acc[column.id] = data.filter((card) => card.status === column.id);
          return acc;
        },
        {} as Record<string, Task[]>,
      ),
    [data],
  );

  return (
    <main className="flex h-full p-24">
      {KANBAN_COLUMNS.map((column) => (
        <Column
          key={column.id}
          title={column.title}
          color={column.color}
          hasBorder={column.hasBorder}
          cards={columnCards[column.id]}
        />
      ))}
    </main>
  );
}
