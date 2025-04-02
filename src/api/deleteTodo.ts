import { KanbanData, TodoStatus } from "@/types/todo";

/**
 * 기존 할 일을 Kanban 보드에서 삭제합니다.
 * @param {string} id - 삭제할 할 일의 고유 ID
 * @param {TodoStatus} status - 삭제할 할 일이 속한 컬럼 (TODO, ON_PROGRESS, DONE)
 * @param {(updatedKanban: KanbanData) => void} onTasksUpdate - 업데이트된 Kanban 데이터를 처리하는 콜백 함수
 * @returns {Promise<void>}
 */
export const deleteTodo = async (
  id: string,
  status: TodoStatus,
  onTasksUpdate: (updatedKanban: KanbanData) => void,
): Promise<void> => {
  try {
    const response = await fetch("/api", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "할 일 삭제 중 오류가 발생했습니다");
    }

    const result = await response.json();

    // 콜백 함수를 통해 업데이트된 칸반 데이터를 상위 컴포넌트에 전달
    onTasksUpdate(result.kanbanData);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "칸반 데이터 삭제하기 실패",
    );
  }
};
