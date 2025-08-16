import React from "react";

export function Table({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table className="w-full border-collapse text-left text-sm" {...props}>{children}</table>
  );
}

export function THead({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-neutral-50 border-b" {...props}>{children}</thead>;
}

export function TBody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props}>{children}</tbody>;
}

export function TR({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="border-b last:border-0" {...props}>{children}</tr>;
}

export function TH({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="py-3 px-4 font-semibold" {...props}>{children}</th>;
}

export function TD({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="py-3 px-4" {...props}>{children}</td>;
}
