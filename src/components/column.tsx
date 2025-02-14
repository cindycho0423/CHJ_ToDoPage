"use client";

import clsx from "clsx";
import Image from "next/image";

import { useModalStore } from "@/store/useModalStore";
import type { Task, TaskStatus } from "@/types/task";

import Card from "./card";
import CreateEditTaskModal from "./create-edit-task-modal";

interface ColumnProps {
  status: TaskStatus;
  title: string;
  color: "red" | "green" | "blue";
  hasBorder?: boolean;
  cards?: Array<{
    id: string;
    title: string;
    content: string;
    status: TaskStatus;
    dueDate: string;
  }>;
  onTasksUpdate?: (tasks: Task[]) => void;
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
        status: status,
        content: "",
        dueDate: "",
      },
      status: status,
      onTasksUpdate,
    });
  };

  return (
    <div
      className={clsx("flex-1 px-20", {
        "border-x border-solid border-white/50": hasBorder,
      })}
    >
      <div
        className={clsx(
          colorClasses[color],
          "todo-title-circle relative ml-20 text-20 font-bold",
        )}
      >
        {title}
      </div>
      <button
        type="button"
        className="mt-12 inline-block w-full rounded-4 border border-solid"
        onClick={handleCreateTask}
      >
        <Image
          src="/icons/ic_plus.svg"
          alt="plus"
          width={25}
          height={25}
          className="m-auto"
        />
      </button>
      {cards.map((card) => (
        <Card key={card.id} {...card} onTasksUpdate={onTasksUpdate} />
      ))}
    </div>
  );
}
