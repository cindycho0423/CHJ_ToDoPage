import { z } from "zod";

const taskSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "제목은 필수입니다")
    .max(50, "제목은 50자를 초과할 수 없습니다"),
  content: z.string().max(500, "설명은 500자를 초과할 수 없습니다"),
  dueDate: z
    .string()
    .min(1, "마감일은 필수입니다")
    .refine((date) => {
      const today = new Date().toISOString().split("T")[0];
      return date >= today;
    }, "마감일은 오늘 이후여야 합니다"),
  status: z.string(),
});

export default taskSchema;
