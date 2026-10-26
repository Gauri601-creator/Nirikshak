import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 
    | 'success' 
    | 'warning' 
    | 'danger' 
    | 'info' 
    | 'neutral' 
    | 'purple'
    | 'verified'
    | 'pending'
    | 'needs-correction'
    | 'flagged';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false,
}) => {
  // Normalize semantic variants
  let effectiveVariant = variant;
  if (variant === 'verified') effectiveVariant = 'success';
  if (variant === 'pending') effectiveVariant = 'info';
  if (variant === 'needs-correction') effectiveVariant = 'warning';
  if (variant === 'flagged') effectiveVariant = 'danger';

  const variantStyles: Record<string, { bg: string; text: string; border: string; dotColor: string }> = {
    success: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dotColor: 'bg-amber-500',
    },
    danger: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      dotColor: 'bg-red-500',
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dotColor: 'bg-blue-500',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      dotColor: 'bg-purple-500',
    },
    neutral: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dotColor: 'bg-slate-400',
    },
  };

  const current = variantStyles[effectiveVariant] || variantStyles.neutral;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor} shrink-0`} />}
      <span>{children}</span>
    </span>
  );
};
