import { ComponentProps } from "react";

const Button = (props: ComponentProps<"button">) => {
  return (
    <button
      {...props}
      className={`p-4 my-2 flex items-center justify-center hover:bg-indigo-500 active:scale-90 transition-all duration-200 gap-x-4 rounded-md bg-indigo-600 ${
        props.className || ""
      }`}
    >
      {props.children}
    </button>
  );
};

export default Button;
