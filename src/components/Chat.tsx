import { CSV } from "../types/CSV";
import Table from "./Table";

export type MessageProps = {
  role: "user" | "ai";
  content: string;
  table?: CSV; //csv
};

export function Message({ role, content, table }: MessageProps) {
  return (
    <div className="p-4 rounded-md  ">
      <h3 className="capitalize font-black">{role}</h3>
      <div className="bg-neutral-700 p-4 text-base border-neutral-600">
        {content}
      </div>
      {table && <Table table={table} />}
    </div>
  );
}
