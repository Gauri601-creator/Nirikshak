import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  label: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  accentBorderColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  label,
  trend,
  icon,
  iconBgColor = 'bg-blue-50 text-blue-600',
  accentBorderColor = 'border-slate-200',
}) => {
  return (
    <div
      className={`bg-white rounded-xl p-5 border ${accentBorderColor} card-shadow card-shadow-hover relative overflow-hidden flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-mono tracking-tight">
            {value}
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium truncate">{label}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold shrink-0 ${
              trend.isPositive ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
