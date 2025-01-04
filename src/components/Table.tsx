import React, { ReactNode } from "react";
import { CSV } from "../types/CSV";

type TableProps = {
  table: CSV;
};

const Table = ({ table }: TableProps) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {table.columns.map((el, i) => {
              return (
                <th key={i} scope="col" className="px-6 py-3">
                  {el}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {table.data.map((arr, i) => {
            return (
              <tr
                key={i}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                {arr.map((v, j) => {
                  return (
                    <td key={j} className="px-6 py-4">
                      {v as ReactNode}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
