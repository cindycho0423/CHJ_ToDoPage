import { KanbanData, Todo, TodoStatus } from "@/types/todo";

/**
 * 새로운 할 일을 생성하여 Kanban 보드에 추가합니다.
 * @param {Todo} data - 생성할 할 일 데이터
 * @param {TodoStatus} status - 할 일이 추가될 컬럼 (TODO, ON_PROGRESS, DONE)
 * @param {(updatedKanban: KanbanData) => void} onTasksUpdate - 업데이트된 Kanban 데이터를 처리하는 콜백 함수
 * @returns {Promise<void>}
 */
export const createTodo = async (
  data: Todo,
  status: TodoStatus,
  onTasksUpdate: (updatedKanban: KanbanData) => void,
): Promise<void> => {
  try {
    const { id, ...taskData } = data;

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...taskData,
        status,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "할 일 생성 중 오류가 발생했습니다");
    }

    const result = await response.json();

    onTasksUpdate?.(result.kanbanData);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "칸반 데이타 생성하기 실패",
    );
  }
};
