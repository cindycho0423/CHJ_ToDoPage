import { ComponentProps } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends ComponentProps<"input"> {
  id: string;
  label: string;
  type?: "text" | "date";
  errorMessage?: string;
  register: UseFormRegisterReturn;
}

export default function Input({
  id,
  label,
  type = "text",
  errorMessage = "",
  register,
  disabled,
  ...props
}: InputProps) {
  return (
    <>
      <div className="relative mb-12">
        <label htmlFor={id} className="mb-8 inline-block w-full">
          {label}
        </label>
        <input
          id={id}
          required
          type={type}
          disabled={disabled}
          className="w-full rounded-4 border border-solid bg-black/80 p-10 outline-none"
          {...register}
          {...props}
        />
        {errorMessage && (
          <span className="ml-10 text-13 text-red-600">{errorMessage}</span>
        )}
      </div>
    </>
  );
}
