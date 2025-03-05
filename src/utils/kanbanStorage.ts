import { KanbanData, Todo } from "@/types/todo";

/**
 * 로컬 스토리지에서 Kanban 데이터를 불러옵니다.
 * 오류 발생 시 기본 데이터를 반환합니다.
 * @returns {KanbanData} 현재 Kanban 데이터
 */
export const getStoredKanbanData = (): KanbanData => {
  try {
    const savedData = localStorage.getItem("KanbanData");
    return savedData
      ? JSON.parse(savedData)
      : { TODO: [], ON_PROGRESS: [], DONE: [] };
  } catch (e) {
    alert("데이터를 불러오는 중 오류가 발생했습니다.");
    return { TODO: [], ON_PROGRESS: [], DONE: [] };
  }
};

/**
 * 기존 할 일을 수정합니다.
 * @param {Todo} data - 수정된 할 일 데이터
 * @param {Todo} initialData - 기존 할 일 데이터 (id 기준으로 찾기 위함)
 * @param {(updatedKanban: KanbanData) => void} onTasksUpdate - 업데이트된 Kanban 데이터를 처리하는 콜백 함수
 * @throws {Error} 해당 작업을 찾을 수 없는 경우 예외를 발생시킵니다.
 */
export const updateTask = (
  data: Todo,
  initialData: Todo,
  onTasksUpdate: (updatedKanban: KanbanData) => void,
) => {
  const currentKanban = getStoredKanbanData();
  const updatedKanban = { ...currentKanban };
  let found = false;

  (["TODO", "ON_PROGRESS", "DONE"] as const).forEach((column) => {
    const taskIndex = updatedKanban[column].findIndex(
      (task) => task.id === initialData.id,
    );

    if (taskIndex !== -1) {
      updatedKanban[column] = [...updatedKanban[column]];
      updatedKanban[column][taskIndex] = { ...data, id: initialData.id };
      found = true;
    }
  });

  if (!found) {
    alert(
      "해당 작업을 찾을 수 없습니다. 이미 삭제되었거나 존재하지 않는 작업입니다.",
    );
    throw new Error("Task not found");
  }

  localStorage.setItem("KanbanData", JSON.stringify(updatedKanban));
  onTasksUpdate?.(updatedKanban);
};
