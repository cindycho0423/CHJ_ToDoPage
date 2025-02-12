import { useModalStore } from "@/store/useModalStore";
import Modal from "./common/modal";
import Button from "./common/button";

interface DeleteModalProps {
  id: string;
}

export default function DeleteModal({ id }: DeleteModalProps) {
  const { isOpen, closeModal } = useModalStore();

  const handleDelete = () => {
    console.log(id);
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
