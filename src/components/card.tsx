import Image from "next/image";

import { useModalStore } from "@/store/useModalStore";
import type { Task, TaskStatus } from "@/types/task";

import Badge from "./badge";
import Popover from "./common/popover";
import CreateEditTask from "./create-edit-task-modal";
import DeleteModal from "./delete-modal";

interface CardProps {
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
  dueDate: string;
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function Card({
  id,
  title,
  content,
  status,
  dueDate,
  onTasksUpdate,
}: CardProps) {
  const { openModal } = useModalStore();

  const handleEdit = () => {
    openModal(CreateEditTask, {
      mode: "edit",
      initialData: {
        id,
        title,
        status,
        content,
        dueDate,
      },
      onTasksUpdate,
    });
  };

  const handleDelete = () => {
    openModal(DeleteModal, { id, onTasksUpdate });
  };

  return (
    <div className="my-12 flex h-140 flex-col rounded-4 border border-solid bg-white/15 p-12 md:min-h-180 md:p-16">
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="mr-6 line-clamp-1 text-18 font-semibold md:text-22">
            {title}
          </span>
          <Badge status={status} />
        </div>
        <Popover>
          <Popover.Toggle className="relative size-30">
            <Image src="/icons/ic_kebab.svg" alt="kebab" fill />
          </Popover.Toggle>
          <Popover.Wrapper>
            <Popover.Item onClick={handleEdit}>수정하기</Popover.Item>
            <Popover.Item onClick={handleDelete}>삭제하기</Popover.Item>
          </Popover.Wrapper>
        </Popover>
      </div>
      <div className="max-h-100 overflow-auto text-14 md:text-16">
        {content}
      </div>
      <span className="mt-auto inline-block text-right text-12 md:text-14">
        마감일: {dueDate}
      </span>
    </div>
  );
}
