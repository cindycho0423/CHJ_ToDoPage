import { KanbanData } from "@/types/todo";

/**
 * Kanban 보드의 데이터를 Firestore에 업데이트합니다.
 * @param {KanbanData} updatedKanban - 업데이트할 Kanban 데이터
 * @returns {Promise}
 */
export const updateKanbanData = async (
  updatedKanban: KanbanData,
): Promise<void> => {
  try {
    const response = await fetch("/api", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatedKanban }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "칸반 데이터 업데이트 실패");
    }

    // 성공적으로 업데이트됐지만 별도의 처리 없이 종료
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "칸반 데이터 업데이트 실패",
    );
  }
};
