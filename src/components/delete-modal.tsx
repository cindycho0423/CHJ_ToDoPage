"use client";

import { useModalStore } from "@/store/useModalStore";
import { Task } from "@/types/task";

import Button from "./common/button";
import Modal from "./common/modal";

interface DeleteModalProps {
  id: string;
  onTasksUpdate: (tasks: Task[]) => void;
}

export default function DeleteModal({ id, onTasksUpdate }: DeleteModalProps) {
  const { isOpen, closeModal } = useModalStore();
  const handleDelete = () => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      const currentTasks: Task[] = savedTasks ? JSON.parse(savedTasks) : [];

      const updatedTasks = currentTasks.filter((task) => task.id !== id);

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      onTasksUpdate(updatedTasks);
      closeModal();
    } catch (error) {
      // 에러 토스트 처리
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
