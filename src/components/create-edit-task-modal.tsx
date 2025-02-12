"use client";

import { useModalStore } from "@/store/useModalStore";

import Button from "./common/button";
import Input from "./common/input";
import Modal from "./common/modal";

interface CreateEditTaskModalProps {
  mode?: "create" | "edit";
  initialData?: {
    title: string;
    status: string;
    content: string;
    dueDate: string;
  };
}

export default function CreateEditTaskModal({
  mode = "create",
  initialData,
}: CreateEditTaskModalProps) {
  const { isOpen, closeModal } = useModalStore();

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <span className="mb-20 inline-block text-24">
        할 일 {mode === "create" ? "생성" : "수정"}
      </span>
      <form>
        <Input
          id="title"
          label="제목"
          placeholder="제목을 입력해주세요"
          defaultValue={initialData?.title}
        />
        <label htmlFor="content" className="mb-8 inline-block w-full">
          설명
        </label>
        <textarea
          id="content"
          placeholder="설명을 입력해주세요"
          className="mb-12 w-full rounded-4 border border-solid bg-black/80 p-10 outline-none"
          defaultValue={initialData?.content}
        />
        <Input
          id="dueDate"
          label="마감일"
          placeholder="날짜를 입력해주세요"
          type="date"
          defaultValue={initialData?.dueDate}
        />
        <div className="mt-20 flex gap-8">
          <Button text="취소" type="button" onClick={closeModal} />
          <Button
            text={mode === "create" ? "생성" : "수정"}
            type="button"
            onClick={() => {}}
            className="bg-white text-black"
          />
        </div>
      </form>
    </Modal>
  );
}
