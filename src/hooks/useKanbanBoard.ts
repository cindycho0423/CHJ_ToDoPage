import { DragOverEvent, useSensor, useSensors } from "@dnd-kit/core";
import {
  KeyboardSensor as LibKeyboardSensor,
  MouseSensor as LibMouseSensor,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useState } from "react";

import { getKanbanData } from "@/api/getKanban";
import { updateKanbanData } from "@/api/updateKanban";
import type { KanbanData, TodoStatus } from "@/types/todo";

const initialKanbanData: KanbanData = {
  TODO: [],
  ON_PROGRESS: [],
  DONE: [],
};

/**
 * Kanban 보드의 상태와 드래그 앤 드롭 이벤트를 관리하는 커스텀 훅
 * @returns {{
 *   todos: KanbanData;
 *   setTodos: React.Dispatch<React.SetStateAction<KanbanData>>;
 *   handleDragOver: (event: DragOverEvent) => void;
 *   handleDragEnd: () => void;
 *   sensors: SensorDescriptor<any>[];
 *   isLoading: boolean;
 *   error: string | null;
 * }} Kanban 보드 관련 상태 및 핸들러 반환
 */
export const useKanbanBoard = () => {
  const [todos, setTodos] = useState<KanbanData>(initialKanbanData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 같은 컬럼 내에서 카드의 순서를 변경합니다.
   * @param {TodoStatus} activeStatus - 현재 드래그 중인 카드의 상태
   * @param {number} activeIndex - 드래그한 카드의 기존 위치
   * @param {number} overIndex - 드래그한 카드가 놓일 새로운 위치
   */
  const handleSameColumnMove = (
    activeStatus: TodoStatus,
    activeIndex: number,
    overIndex: number,
  ) => {
    setTodos((prev) => ({
      ...prev,
      [activeStatus]: arrayMove(prev[activeStatus], activeIndex, overIndex),
    }));
  };

  /**
   * 다른 컬럼으로 카드를 이동시킵니다.
   * @param {TodoStatus} activeStatus - 원래 카드가 있던 컬럼
   * @param {TodoStatus} overStatus - 카드가 이동할 새로운 컬럼
   * @param {number} activeIndex - 원래 컬럼에서의 카드 위치
   * @param {number} overIndex - 새 컬럼에서의 카드 위치
   */
  const handleDifferentColumnMove = (
    activeStatus: TodoStatus,
    overStatus: TodoStatus,
    activeIndex: number,
    overIndex: number,
  ) => {
    setTodos((prev) => {
      const activeCards = [...prev[activeStatus]];
      const overCards = [...prev[overStatus]];
      const [movedCard] = activeCards.splice(activeIndex, 1);

      overCards.splice(overIndex, 0, movedCard);

      return {
        ...prev,
        [activeStatus]: activeCards,
        [overStatus]: overCards,
      };
    });
  };

  /**
   * 드래그 중일 때 호출되며, 카드 이동 로직을 처리합니다.
   * @param {DragOverEvent} event - DnD 라이브러리에서 제공하는 이벤트 객체
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return; // 드래그 대상이 보드 영역 밖이면 종료

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return; // 같은 위치에서 이동 시도하면 종료

    const activeData = active.data.current; // 현재 드래그 중인 카드 데이터
    const overData = over.data.current; // 현재 위치한 대상 데이터

    // 드래그 중인 카드의 상태 및 인덱스 가져오기
    const activeStatus: TodoStatus = activeData?.status;
    const activeIndex = activeData?.index;

    // 드롭 대상이 카드인지 컬럼인지에 따라 상태 및 인덱스 결정
    const overStatus: TodoStatus =
      overData?.type === "Card" ? overData.status : (over.id as TodoStatus);
    const overIndex =
      overData?.type === "Card" ? overData.index : todos[overStatus].length;

    // 같은 컬럼 내 이동인지 다른 컬럼으로 이동인지 판별
    if (activeStatus === overStatus) {
      handleSameColumnMove(activeStatus, activeIndex, overIndex);
    } else {
      handleDifferentColumnMove(
        activeStatus,
        overStatus,
        activeIndex,
        overIndex,
      );
    }
  };

  /**
   * 드래그가 끝났을 때 Firestore에 Kanban 데이터를 저장합니다.
   */
  const handleDragEnd = async () => {
    try {
      setIsLoading(true);
      await updateKanbanData(todos);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      alert("데이터를 저장하는 중에 에러가 났습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * DOM 트리를 순회하면서 드래그 앤 드롭 처리 여부를 확인하는 함수
   * 'data-no-dnd' 속성이 있는 요소를 만나면 드래그 앤 드롭을 비활성화합니다.
   *
   * @param element - 검사할 DOM 요소
   * @returns {boolean} - 드래그 앤 드롭 처리 여부 (true: 처리함, false: 처리하지 않음)
   */
  function shouldHandleEvent(element: HTMLElement | null): boolean {
    let cur = element;
    while (cur) {
      if (cur.dataset && cur.dataset.noDnd) {
        return false;
      }
      cur = cur.parentElement;
    }
    return true;
  }

  /**
   * 마우스 드래그 앤 드롭을 위한 커스텀 센서 클래스
   * LibMouseSensor를 확장하여 특정 요소에서 드래그 앤 드롭이 발생하지 않도록 제어합니다.
   */
  class CustomMouseSensor extends LibMouseSensor {
    static activators = [
      {
        eventName: "onMouseDown" as const,
        handler: ({ nativeEvent: event }: MouseEvent) => {
          return shouldHandleEvent(event.target as HTMLElement);
        },
      },
    ];
  }

  /**
   * 키보드 드래그 앤 드롭을 위한 커스텀 센서 클래스
   * LibKeyboardSensor를 확장하여 특정 요소에서 드래그 앤 드롭이 발생하지 않도록 제어합니다.
   */
  class CustomKeyboardSensor extends LibKeyboardSensor {
    static activators = [
      {
        eventName: "onKeyDown" as const,
        handler: ({ nativeEvent: event }: KeyboardEvent) => {
          return shouldHandleEvent(event.target as HTMLElement);
        },
      },
    ];
  }

  const sensors = useSensors(
    useSensor(CustomMouseSensor),
    useSensor(CustomKeyboardSensor),
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await getKanbanData();
      setTodos(data);
    };
    fetchData();
  }, []);

  return {
    todos,
    setTodos,
    handleDragOver,
    handleDragEnd,
    sensors,
    isLoading,
    error,
  };
};
