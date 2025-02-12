import clsx from "clsx";

interface ButtonProps {
  text: string;
  type: "button" | "submit";
  onClick: () => void;
  className?: string;
}
export default function Button({
  text,
  type = "button",
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "mt-12 inline-block w-full rounded-4 border border-solid px-10 py-6",
        className,
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
