"use client";

import { useEffect, useState } from "react";

import Column from "@/components/column";
import { KANBAN_COLUMNS } from "@/constants/kanban";
import type { KanbanData, TodoStatus } from "@/types/todo";

export default function Home() {
  const [kanbanData, setKanbanData] = useState<KanbanData>();

  useEffect(() => {
    const savedData = localStorage.getItem("KanbanData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setKanbanData(parsedData);
      } catch (e) {
        alert("데이터를 받아오는 중에 에러가 났습니다.");
      }
    }
  }, []);

  const handleTasksUpdate = (updatedTodo: KanbanData) => {
    setKanbanData(updatedTodo);
    localStorage.setItem("KanbanData", JSON.stringify(updatedTodo));
  };

  return (
    <main className="h-fit min-h-full p-24 md:flex md:overflow-scroll">
      {KANBAN_COLUMNS.map((column) => (
        <Column
          key={column.id}
          status={column.id as TodoStatus}
          title={column.title}
          color={column.color}
          hasBorder={column.hasBorder}
          cards={kanbanData && kanbanData[column.id]}
          onTasksUpdate={handleTasksUpdate}
        />
      ))}
    </main>
  );
}
