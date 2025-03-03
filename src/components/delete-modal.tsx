"use client";

import { deleteTodo } from "@/api/deleteTodo";
import { useModalStore } from "@/store/useModalStore";
import { KanbanData, TodoStatus } from "@/types/todo";

import Button from "./common/button";
import Modal from "./common/modal";

interface DeleteModalProps {
  id: string;
  status: TodoStatus;
  onTasksUpdate: (kanbanData: KanbanData) => void;
}

export default function DeleteModal({
  id,
  status,
  onTasksUpdate,
}: DeleteModalProps) {
  const { isOpen, closeModal } = useModalStore();
  const handleDelete = () => {
    try {
      deleteTodo(id, status, onTasksUpdate);
      closeModal();
    } catch {
      alert("삭제 중 문제가 발생했습니다. 다시 시도해보세요.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="mx-30 my-20 text-20">일정을 삭제하시겠습니까?</div>
      <div className="mb-10 flex gap-8">
        <Button text="취소하기" type="button" onClick={closeModal} />
        <Button
          text="삭제하기"
          type="button"
          onClick={handleDelete}
          className="bg-white text-black"
        />
      </div>
    </Modal>
  );
}
