"use client";

import clsx from "clsx";
import Image from "next/image";

import { useModalStore } from "@/store/useModalStore";
import type { KanbanData, Todo, TodoStatus } from "@/types/todo";

import Card from "./card";
import Button from "./common/button";
import CreateEditTaskModal from "./create-edit-task-modal";

interface ColumnProps {
  status: TodoStatus;
  title: string;
  color: "red" | "green" | "blue";
  hasBorder?: boolean;
  cards?: Todo[];
  onTasksUpdate: (todos: KanbanData) => void;
}

const colorClasses = {
  red: "before:bg-red-400/80",
  green: "before:bg-green-400/80",
  blue: "before:bg-blue-400/80",
};

export default function Column({
  status,
  title,
  color,
  hasBorder,
  cards = [],
  onTasksUpdate,
}: ColumnProps) {
  const { openModal } = useModalStore();

  const handleCreateTask = () => {
    openModal(CreateEditTaskModal, {
      mode: "create",
      initialData: {
        id: "",
        title: "",
        description: "",
        dueDate: "",
      },
      status: status,
      onTasksUpdate,
    });
  };

  return (
    <div
      className={clsx("flex-1 px-20", {
        "my-20 border-y border-solid border-white/50 py-20 md:my-0 md:border-x md:border-y-0 md:py-0":
          hasBorder,
      })}
    >
      <div className="flex items-center justify-between md:flex-col md:items-start">
        <div
          className={clsx(
            colorClasses[color],
            "todo-title-circle relative ml-20 text-22 font-bold md:text-26",
          )}
        >
          {title}
        </div>
        <Button
          type="button"
          className="size-30 rounded-4 border border-solid p-0 hover:bg-white/20 md:mt-12 md:w-full"
          onClick={handleCreateTask}
        >
          <Image
            src="/icons/ic_plus.svg"
            alt="plus"
            width={25}
            height={25}
            className="m-auto"
          />
        </Button>
      </div>
      {cards.map((card) => (
        <Card
          key={card.id}
          status={status}
          {...card}
          onTasksUpdate={onTasksUpdate}
        />
      ))}
    </div>
  );
}
