"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import todoSchema from "@/schemas/createTodo";
import { useModalStore } from "@/store/useModalStore";
import { KanbanData, Todo, TodoStatus } from "@/types/todo";

import Button from "./common/button";
import Input from "./common/input";
import Modal from "./common/modal";

interface CreateEditTaskModalProps {
  mode?: "create" | "edit";
  initialData?: Todo;
  status?: TodoStatus;
  onTasksUpdate?: (kanbanData: KanbanData) => void;
}

export default function CreateEditTaskModal({
  mode = "create",
  initialData,
  status,
  onTasksUpdate,
}: CreateEditTaskModalProps) {
  const { isOpen, closeModal } = useModalStore();
  const id = uuid();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<Todo>({
    resolver: zodResolver(todoSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: Todo) => {
    try {
      const savedTodo = localStorage.getItem("KanbanData");
      const currentKanban: KanbanData = savedTodo
        ? JSON.parse(savedTodo)
        : {
            TODO: [],
            ON_PROGRESS: [],
            DONE: [],
          };

      if (mode === "create") {
        const newTask: Todo = {
          ...data,
          id: id,
        };

        const targetStatus = status || "TODO";

        currentKanban[targetStatus] = [newTask, ...currentKanban[targetStatus]];

        localStorage.setItem("KanbanData", JSON.stringify(currentKanban));
        onTasksUpdate?.(currentKanban);
      } else if (mode === "edit" && initialData) {
        const updatedKanban = { ...currentKanban };
        let found = false;

        for (const column of ["TODO", "ON_PROGRESS", "DONE"] as const) {
          const taskIndex = currentKanban[column].findIndex(
            (task) => task.id === initialData.id,
          );

          if (taskIndex !== -1) {
            updatedKanban[column] = [...currentKanban[column]];
            updatedKanban[column][taskIndex] = {
              ...data,
              id: initialData.id,
            };
            found = true;
            break;
          }
        }

        if (!found) {
          throw new Error("Task not found");
        }

        localStorage.setItem("KanbanData", JSON.stringify(updatedKanban));
        onTasksUpdate?.(updatedKanban);
      }

      reset();
      closeModal();
    } catch (e) {
      setError("root", {
        type: "manual",
        message: "태스크 저장 중 오류가 발생했습니다",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="w-320 md:w-360">
      <span className="mb-20 inline-block text-24 font-bold">
        할 일 {mode === "create" ? "생성" : "수정"}
      </span>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}

        <div className="mb-12">
          <Input
            id="title"
            label="제목 *"
            placeholder="제목을 입력해주세요"
            errorMessage={errors.title?.message}
            register={register("title")}
          />
        </div>

        <div className="mb-12">
          <label htmlFor="content" className="mb-8 inline-block w-full">
            설명
          </label>
          <textarea
            id="description"
            placeholder="설명을 입력해주세요"
            className="mb-12 w-full rounded-4 border border-solid bg-black/80 p-10 outline-none"
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="mb-12">
          <Input
            id="dueDate"
            label="마감일 *"
            type="date"
            register={register("dueDate")}
            errorMessage={errors.dueDate?.message}
          />
        </div>

        <div className="mt-20 flex gap-8">
          <Button
            text="취소"
            type="button"
            onClick={() => {
              reset();
              closeModal();
            }}
          />
          <Button
            text={mode === "create" ? "생성" : "수정"}
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-black disabled:opacity-50"
          />
        </div>
      </form>
    </Modal>
  );
}
