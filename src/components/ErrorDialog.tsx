import { Info } from "@phosphor-icons/react";
import { ReactNode } from "react";
type ErrorDialogProps = {
  children: ReactNode;
  error?: string | null;
};
const ErrorDialog = ({ children, error }: ErrorDialogProps) => {
  return (
    <div
      className="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md"
      role="alert"
    >
      <div className="flex">
        <div className="py-1">
          <Info className="fill-current h-6 w-6 text-red-500 mr-4"></Info>
        </div>

        <div className="text-lg">
          <h2 className="text-xl font-bold text-neutral-800">
            {" "}
            An Error has occurred{" "}
          </h2>
          {children || error}
          <p>Please try again</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;
