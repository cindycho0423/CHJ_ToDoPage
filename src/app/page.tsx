"use client";

import { useEffect, useMemo, useState } from "react";

import Column from "@/components/column";
import { KANBAN_COLUMNS } from "@/constants/kanban";
import { Task } from "@/types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (e) {
        localStorage.removeItem("tasks");
      }
    }
  }, []);

  const handleTasksUpdate = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const columnCards = useMemo(
    () =>
      KANBAN_COLUMNS.reduce(
        (acc, column) => {
          acc[column.id] = tasks.filter((card) => card.status === column.id);
          return acc;
        },
        {} as Record<string, Task[]>,
      ),
    [tasks],
  );

  return (
    <main className="flex p-24">
      {KANBAN_COLUMNS.map((column) => (
        <Column
          key={column.id}
          status={column.id}
          title={column.title}
          color={column.color}
          hasBorder={column.hasBorder}
          cards={columnCards[column.id]}
          onTasksUpdate={handleTasksUpdate}
        />
      ))}
    </main>
  );
}
