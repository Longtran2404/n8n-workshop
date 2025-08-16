import React from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {description && <p className="text-neutral-500 mb-4">{description}</p>}
      {action}
    </div>
  );
}
