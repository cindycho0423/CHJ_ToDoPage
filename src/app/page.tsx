"use client";

import { closestCenter, DndContext, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import Column from "@/components/column";
import type { KanbanData, TodoStatus } from "@/types/todo";

interface KanbanBoardProps {
  initialData: KanbanData;
}

export default function KanbanBoard({ initialData }: KanbanBoardProps) {
  const [todos, setTodos] = useState<KanbanData>(initialData);

  useEffect(() => {
    const savedData = localStorage.getItem("KanbanData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTodos(parsedData);
      } catch (e) {
        alert("데이터를 받아오는 중에 에러가 났습니다.");
      }
    }
  }, []);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const activeStatus: TodoStatus = activeData?.status;
    const activeIndex = activeData?.index;

    const overStatus: TodoStatus =
      overData?.type === "Card" ? overData.status : (over.id as TodoStatus);
    const overIndex =
      overData?.type === "Card" ? overData.index : todos[overStatus].length;

    if (activeStatus === overStatus) {
      setTodos((prev) => ({
        ...prev,
        [activeStatus]: arrayMove(prev[activeStatus], activeIndex, overIndex),
      }));
    } else {
      setTodos((prev) => {
        const activeCards = [...prev[activeStatus]];
        const overCards = [...prev[overStatus]];
        const [movedCard] = activeCards.splice(activeIndex, 1);

        overCards.splice(overIndex, 0, movedCard);

        return {
          ...prev,
          [activeStatus]: activeCards,
          [overStatus]: overCards,
        };
      });
    }
  };

  const handleDragEnd = () => {
    try {
      localStorage.setItem("KanbanData", JSON.stringify(todos));
    } catch (e) {
      alert("데이터를 저장하는 중에 에러가 났습니다.");
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-fit min-h-full flex-col p-20 md:flex-row">
        <Column
          status="TODO"
          title="Todo"
          color="red"
          cards={todos?.TODO}
          onTasksUpdate={setTodos}
        />
        <Column
          status="ON_PROGRESS"
          title="OnProgress"
          color="blue"
          hasBorder
          cards={todos?.ON_PROGRESS}
          onTasksUpdate={setTodos}
        />
        <Column
          status="DONE"
          title="Done"
          color="green"
          cards={todos?.DONE}
          onTasksUpdate={setTodos}
        />
      </div>
    </DndContext>
  );
}
