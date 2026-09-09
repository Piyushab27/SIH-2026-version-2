import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-2">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
