"use client";

import { useModalStore } from "@/store/useModalStore";
import { KanbanData } from "@/types/todo";

import Button from "./common/button";
import Modal from "./common/modal";

interface DeleteModalProps {
  id: string;
  onTasksUpdate: (kanbanData: KanbanData) => void;
}

export default function DeleteModal({ id, onTasksUpdate }: DeleteModalProps) {
  const { isOpen, closeModal } = useModalStore();

  const handleDelete = () => {
    try {
      const savedData = localStorage.getItem("KanbanData");
      const currentKanban: KanbanData = savedData
        ? JSON.parse(savedData)
        : {
            TODO: [],
            ON_PROGRESS: [],
            DONE: [],
          };

      // 모든 컬럼에서 해당 id를 가진 태스크를 찾아 제거
      const updatedKanban: KanbanData = {
        TODO: currentKanban.TODO.filter((task) => task.id !== id),
        ON_PROGRESS: currentKanban.ON_PROGRESS.filter((task) => task.id !== id),
        DONE: currentKanban.DONE.filter((task) => task.id !== id),
      };

      localStorage.setItem("KanbanData", JSON.stringify(updatedKanban));
      onTasksUpdate(updatedKanban);
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
