import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  accentColor?: 'emerald' | 'amber' | 'sky' | 'rose' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  accentColor = 'slate',
}) => {
  const borderColors = {
    emerald: 'border-l-4 border-l-emerald-600',
    amber: 'border-l-4 border-l-amber-500',
    sky: 'border-l-4 border-l-sky-600',
    rose: 'border-l-4 border-l-rose-600',
    slate: 'border-l-4 border-l-slate-700',
  }[accentColor];

  return (
    <div className={`p-4 bg-white rounded-lg border border-slate-200 shadow-2xs ${borderColors}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">{value}</span>
      </div>
      {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
    </div>
  );
};
