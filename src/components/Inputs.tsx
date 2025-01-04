import { ComponentProps, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  (props, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`p-4 md:py-6 md:px-4 h-6 w-full focus:outline-none border-2 rounded-md border-neutral-600 bg-neutral-700 text-white focus:border-indigo-600 ${
          props.className || ""
        }`}
      />
    );
  }
);

export { Input };
