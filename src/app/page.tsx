"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";

import Column from "@/components/column";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";

export default function KanbanBoard() {
  const { todos, setTodos, handleDragOver, handleDragEnd, sensors } =
    useKanbanBoard();
  return (
    <DndContext
      sensors={sensors}
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
