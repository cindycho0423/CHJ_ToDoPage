export const KANBAN_COLUMNS = [
  {
    id: "todo",
    title: "Todo",
    color: "before:bg-red-400/80",
    hasBorder: false,
  },
  {
    id: "onProgress",
    title: "OnProgress",
    color: "before:bg-green-400/80",
    hasBorder: true,
  },
  {
    id: "done",
    title: "Done",
    color: "before:bg-blue-400/80",
    hasBorder: false,
  },
] as const;

export default KANBAN_COLUMNS;
