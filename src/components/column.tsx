"use client";

import clsx from "clsx";
import Image from "next/image";

import type { TaskStatus } from "@/types/task";

import Card from "./card";
import { useModalStore } from "@/store/useModalStore";
import Modal from "./common/modal";
import colorClasses from "@/constants/color";
interface ColumnProps {
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
}

export default function Column({
  title,
  color,
  hasBorder,
  cards = [],
}: ColumnProps) {
  const { isOpen, closeModal, openModal } = useModalStore();

  return (
    <div
      className={clsx("flex-1 px-20", {
        "border-x border-solid border-white/50": hasBorder,
      })}
    >
      <div
        className={clsx(
          "todo-title-circle text-20 relative ml-20 font-bold",
          colorClasses[color],
        )}
      >
        {title}
      </div>
      <button
        type="button"
        className="rounded-4 mt-12 inline-block w-full border border-solid"
        onClick={openModal}
      >
        <Image
          src="/icons/plus.svg"
          alt="plus"
          width={25}
          height={25}
          className="m-auto"
        />
      </button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        하이루
      </Modal>
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </div>
  );
}
