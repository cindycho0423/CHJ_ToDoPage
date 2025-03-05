import { doc, getDoc } from "firebase/firestore";

import { FIREBASE_DB } from "@/firebase/firebasedb";
import { KanbanData, Todo, TodoStatus } from "@/types/todo";

import { updateKanbanData } from "./updateKanban";

/**
 * 기존 할 일을 수정합니다.
 * @param {Todo} data - 수정된 할 일 데이터
 * @param {string} todoId - 수정할 할 일의 ID
 * @param {TodoStatus} [currentStatus] - 할 일의 현재 상태(선택적)
 * @param {(updatedKanban: KanbanData) => void} onTasksUpdate - 업데이트된 Kanban 데이터를 처리하는 콜백 함수
 * @throws {Error} 해당 작업을 찾을 수 없는 경우 예외를 발생시킵니다.
 */
export const updateTodo = async (
  data: Todo,
  todoId: string,
  currentStatus?: TodoStatus,
  onTasksUpdate?: (updatedKanban: KanbanData) => void,
) => {
  // Firestore에서 현재 칸반 데이터를 가져옵니다
  const docRef = doc(FIREBASE_DB, "KanbanData", "board");
  const docSnap = await getDoc(docRef);

  // 문서가 존재하지 않는 경우 오류를 표시합니다
  if (!docSnap.exists()) {
    alert("칸반 데이터를 찾을 수 없습니다.");
    throw new Error("Kanban data not found");
  }

  // 현재 칸반 데이터를 가져옵니다
  const currentKanban = docSnap.data() as KanbanData;
  const updatedKanban = { ...currentKanban };
  let found = false;

  // 현재 상태(컬럼)를 알고 있는 경우 해당 컬럼만 검색
  if (currentStatus) {
    const taskIndex = updatedKanban[currentStatus].findIndex(
      (task) => task.id === todoId,
    );

    if (taskIndex !== -1) {
      updatedKanban[currentStatus] = [...updatedKanban[currentStatus]];
      updatedKanban[currentStatus][taskIndex] = { ...data, id: todoId };
      found = true;
    }
  }
  // 상태를 모르는 경우 모든 컬럼을 검색
  else {
    (["TODO", "ON_PROGRESS", "DONE"] as const).forEach((column) => {
      const taskIndex = updatedKanban[column].findIndex(
        (task) => task.id === todoId,
      );

      if (taskIndex !== -1) {
        updatedKanban[column] = [...updatedKanban[column]];
        updatedKanban[column][taskIndex] = { ...data, id: todoId };
        found = true;
      }
    });
  }

  // 해당 할 일을 찾지 못한 경우 오류를 표시합니다
  if (!found) {
    alert(
      "해당 작업을 찾을 수 없습니다. 이미 삭제되었거나 존재하지 않는 작업입니다.",
    );
    throw new Error("Task not found");
  }

  try {
    await updateKanbanData(updatedKanban);
    onTasksUpdate?.(updatedKanban);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "할 일 업데이트 실패",
    );
  }
};
