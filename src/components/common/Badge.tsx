import React from 'react';

interface BadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, variant = 'default', size = 'sm' }) => {
  let styleClasses = 'bg-slate-100 text-slate-700 border border-slate-200';

  const lower = status.toLowerCase();

  if (
    lower === 'verified' ||
    lower === 'allocated' ||
    lower === 'approved' ||
    lower === 'active' ||
    lower === 'resolved' ||
    variant === 'success'
  ) {
    styleClasses = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
  } else if (
    lower === 'pending' ||
    lower === 'submitted' ||
    lower === 'under review' ||
    lower === 'partially occupied' ||
    lower === 'in progress' ||
    variant === 'warning'
  ) {
    styleClasses = 'bg-amber-50 text-amber-800 border border-amber-200';
  } else if (
    lower === 'rejected' ||
    lower === 'full' ||
    lower === 'urgent' ||
    lower === 'revoked' ||
    lower === 'closed' ||
    variant === 'danger'
  ) {
    styleClasses = 'bg-rose-50 text-rose-800 border border-rose-200';
  } else if (
    lower === 'assigned' ||
    lower === 'available' ||
    variant === 'info'
  ) {
    styleClasses = 'bg-sky-50 text-sky-800 border border-sky-200';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span className={`inline-flex items-center font-medium rounded ${padding} ${styleClasses} whitespace-nowrap`}>
      {status}
    </span>
  );
};
