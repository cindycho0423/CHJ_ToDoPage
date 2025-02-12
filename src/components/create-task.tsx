import { useModalStore } from "@/store/useModalStore";
import Modal from "./common/modal";
import Input from "./common/input";
import Button from "./common/button";

export default function CreateTask() {
  const { isOpen, closeModal } = useModalStore();

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <span className="text-24 mb-20 inline-block">할 일 생성</span>
      <form>
        <Input id="title" label="제목" placeholder="제목을 입력해주세요" />
        <label htmlFor="title" className="mb-8 inline-block w-full">
          설명
        </label>
        <textarea
          id="title"
          placeholder="설명을 입력해주세요"
          className="rounded-4 mb-12 w-full border border-solid bg-black/80 p-10 outline-none"
        />
        <Input
          id="dueDate"
          label="마감일"
          placeholder="날짜를 입력해주세요"
          type="date"
        />
        <div className="mt-20 flex gap-8">
          <Button text="취소" type="button" onClick={closeModal} />
          <Button
            text="생성"
            type="button"
            onClick={() => {}}
            className="bg-white text-black"
          />
        </div>
      </form>
    </Modal>
  );
}
