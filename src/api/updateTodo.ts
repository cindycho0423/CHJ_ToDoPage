import { doc, getDoc } from "firebase/firestore";

import { FIREBASE_DB } from "@/firebase/firebasedb";
import { KanbanData, Todo } from "@/types/todo";

import { updateKanbanData } from "./updateKanban";

/**
 * 기존 할 일을 수정합니다. (파이어스토어 버전)
 * @param {Todo} data - 수정된 할 일 데이터
 * @param {Todo} initialData - 기존 할 일 데이터 (id 기준으로 찾기 위함)
 * @param {(updatedKanban: KanbanData) => void} onTasksUpdate - 업데이트된 Kanban 데이터를 처리하는 콜백 함수
 * @throws {Error} 해당 작업을 찾을 수 없는 경우 예외를 발생시킵니다.
 */
export const updateTodo = async (
  data: Todo,
  initialData: Todo,
  onTasksUpdate: (updatedKanban: KanbanData) => void,
) => {
  // Firestore에서 현재 칸반 데이터를 가져옵니다
  const docRef = doc(FIREBASE_DB, "KanbanData", "board");
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // 문서가 존재하지 않는 경우 오류를 표시합니다
    alert("칸반 데이터를 찾을 수 없습니다.");
    throw new Error("Kanban data not found");
  }

  // 현재 칸반 데이터를 가져옵니다
  const currentKanban = docSnap.data() as KanbanData;
  const updatedKanban = { ...currentKanban };
  let found = false;

  // 모든 컬럼을 순회하면서 해당 할 일을 찾습니다
  (["TODO", "ON_PROGRESS", "DONE"] as const).forEach((column) => {
    const taskIndex = updatedKanban[column].findIndex(
      (task) => task.id === initialData.id,
    );

    if (taskIndex !== -1) {
      // 해당 할 일을 찾은 경우 데이터를 업데이트합니다
      updatedKanban[column] = [...updatedKanban[column]];
      updatedKanban[column][taskIndex] = { ...data, id: initialData.id };
      found = true;
    }
  });

  if (!found) {
    // 해당 할 일을 찾지 못한 경우 오류를 표시합니다
    alert(
      "해당 작업을 찾을 수 없습니다. 이미 삭제되었거나 존재하지 않는 작업입니다.",
    );
    throw new Error("Task not found");
  }

  try {
    // 업데이트된 칸반 데이터를 Firestore에 저장합니다
    await updateKanbanData(updatedKanban);

    // 업데이트 성공 시 콜백 함수를 호출합니다
    onTasksUpdate?.(updatedKanban);
  } catch (error) {
    // 에러가 발생한 경우 사용자에게 알립니다
    alert(
      error instanceof Error
        ? `작업 업데이트 실패: ${error.message}`
        : "작업 업데이트 실패",
    );
    throw error;
  }
};
