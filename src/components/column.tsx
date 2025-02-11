import clsx from "clsx";
import Image from "next/image";

import type { TaskStatus } from "@/types/task";

import Card from "./card";

interface ColumnProps {
  title: string;
  color: string;
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
  return (
    <div
      className={clsx("flex-1 px-20", {
        "border-x border-solid border-white/50": hasBorder,
      })}
    >
      <div
        className={clsx(
          "todo-title-circle relative ml-20 text-20 font-bold",
          color,
        )}
      >
        {title}
      </div>
      <button
        type="button"
        className="mt-12 inline-block w-full rounded-4 border border-solid"
      >
        <Image
          src="/icons/plus.svg"
          alt="plus"
          width={25}
          height={25}
          className="m-auto"
        />
      </button>
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </div>
  );
}
