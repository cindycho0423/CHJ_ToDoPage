export const KANBAN_COLUMNS = [
  {
    id: "TODO",
    title: "Todo",
    color: "red",
    hasBorder: false,
  },
  {
    id: "ON_PROGRESS",
    title: "OnProgress",
    color: "green",
    hasBorder: true,
  },
  {
    id: "DONE",
    title: "Done",
    color: "blue",
    hasBorder: false,
  },
] as const;

export default KANBAN_COLUMNS;
