import Image from "next/image";

import { useModalStore } from "@/store/useModalStore";
import type { TaskStatus } from "@/types/task";

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
}

export default function Card({
  id,
  title,
  content,
  status,
  dueDate,
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
    });
  };

  const handleDelete = () => {
    openModal(DeleteModal, { id });
  };

  return (
    <div className="my-12 flex min-h-180 flex-col rounded-4 border border-solid bg-white/15 p-16">
      <div className="flex justify-between">
        <div>
          <span className="mr-12 text-24 font-semibold">{title}</span>
          <Badge status={status} />
        </div>
        <Popover>
          <Popover.Toggle>
            <Image
              src="/icons/ic_kebab.svg"
              alt="kebab"
              width={30}
              height={30}
            />
          </Popover.Toggle>
          <Popover.Wrapper>
            <Popover.Item onClick={handleEdit}>수정하기</Popover.Item>
            <Popover.Item onClick={handleDelete}>삭제하기</Popover.Item>
          </Popover.Wrapper>
        </Popover>
      </div>
      <div className="overflow-auto">{content}</div>
      <span className="mt-auto inline-block text-right text-14">
        마감일: {dueDate}
      </span>
    </div>
  );
}
