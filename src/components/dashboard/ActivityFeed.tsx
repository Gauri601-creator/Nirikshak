import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ActivityFeed: React.FC = () => {
  const { auditEvents } = useApp();
  const recentEvents = auditEvents.slice(0, 6);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Demo Verification Initiated':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Correction Requested':
        return <Send className="w-4 h-4 text-amber-600" />;
      case 'Application Approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Finding Reviewed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Compliance Check Run':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Action Required':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 card-shadow p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Live Regulatory Activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time simulated reviewer actions & pipeline events</p>
        </div>
        <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-live" />
          ACTIVE
        </span>
      </div>

      <div className="divide-y divide-slate-100 mt-2 flex-1">
        {recentEvents.map((evt) => (
          <div key={evt.id} className="py-3 flex items-start gap-3 hover:bg-slate-50/70 p-2 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
              {getActionIcon(evt.action)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] mb-0.5">
                <span className="font-semibold text-slate-900">{evt.action}</span>
                <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {evt.description}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  {evt.applicationId}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">By {evt.user}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ml-auto ${getStatusColor(evt.status)}`}>
                  {evt.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-100 text-center">
        <Link
          to="/audit"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          View Complete Audit Trail <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
