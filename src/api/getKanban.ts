import { KanbanData } from "@/types/todo";

export const getKanbanData = async (): Promise<KanbanData> => {
  try {
    const response = await fetch("/api");
    if (!response.ok) throw new Error("칸반 데이타 불러오기 실패");
    return await response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "칸반 데이타 불러오기 실패",
    );
  }
};
