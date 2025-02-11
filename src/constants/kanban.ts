export const KANBAN_COLUMNS = [
  {
    id: "todo",
    title: "Todo",
    color: "red",
    hasBorder: false,
  },
  {
    id: "onProgress",
    title: "OnProgress",
    color: "green",
    hasBorder: true,
  },
  {
    id: "done",
    title: "Done",
    color: "blue",
    hasBorder: false,
  },
] as const;

export default KANBAN_COLUMNS;
