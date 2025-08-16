import React from "react";

type Crumb = { label: string; href?: string };

type BreadcrumbProps = {
  items: Crumb[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-sm" aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            {item.href ? (
              <a href={item.href} className="underline text-blue-700 hover:text-blue-900">{item.label}</a>
            ) : (
              <span className="text-neutral-500">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="mx-2 text-neutral-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
