import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SearchInput } from '../components/common/SearchInput';
import { Button } from '../components/common/Button';
import { AuditEvent } from '../types';
import { Download, Filter, Info } from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const { auditEvents, exportToCsv } = useApp();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredEvents = auditEvents.filter((evt: AuditEvent) => {
    const matchesSearch =
      evt.applicationId.toLowerCase().includes(search.toLowerCase()) ||
      evt.user.toLowerCase().includes(search.toLowerCase()) ||
      evt.description.toLowerCase().includes(search.toLowerCase()) ||
      evt.action.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || evt.action === actionFilter;
    const matchesStatus = statusFilter === 'ALL' || evt.status === statusFilter;

    return matchesSearch && matchesAction && matchesStatus;
  });

  const handleExportAuditCsv = () => {
    const headers = ['Event ID', 'Timestamp', 'Reviewer / User', 'Application ID', 'Action', 'Description', 'Status'];
    const rows = auditEvents.map((e: AuditEvent) => [
      e.id,
      e.timestamp,
      e.user,
      e.applicationId,
      e.action,
      e.description,
      e.status,
    ]);
    exportToCsv('nirikshak_regulatory_audit_log', headers, rows);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
        return (
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
            Success
          </span>
        );
      case 'Warning':
        return (
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
            Warning
          </span>
        );
      case 'Action Required':
        return (
          <span className="text-[10px] font-bold text-red-800 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
            Action Req.
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-blue-800 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full">
            Info
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Regulatory Audit Trail & Event Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chronological ledger of reviewer decisions, document uploads, and automated verification executions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-4 h-4 text-slate-500" />}
          onClick={handleExportAuditCsv}
        >
          Export Audit Log (CSV)
        </Button>
      </div>

      {/* Prominent Disclaimer Notice */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Demonstration Log Notice:</strong> The audit trail entries displayed below represent
          simulated client-side reviewer events for hackathon demonstration purposes. This does not represent
          a cryptographically secured or immutable backend regulatory server log.
        </div>
      </div>

      {/* Main Audit Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/60">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search audit events by user, app ID, description..."
            className="w-full md:w-80"
          />

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Actions</option>
                <option value="Demo Verification Initiated">Demo Verification</option>
                <option value="Correction Requested">Correction Requested</option>
                <option value="Finding Reviewed">Finding Reviewed</option>
                <option value="Application Approved">Application Approved</option>
                <option value="Review Status Updated">Review Status Updated</option>
                <option value="Document Uploaded">Document Uploaded</option>
                <option value="Application Created">Application Created</option>
                <option value="Compliance Check Run">Compliance Check Run</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Outcomes</option>
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
              <option value="Action Required">Action Required</option>
              <option value="Info">Info</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="table-header border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Reviewer / Operator</th>
                <th className="py-3 px-4 font-semibold">Application ID</th>
                <th className="py-3 px-4 font-semibold">Action Performed</th>
                <th className="py-3 px-4 font-semibold">Description & Context</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((evt: AuditEvent) => (
                  <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                      {evt.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-slate-900 whitespace-nowrap">
                      {evt.user}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">
                      {evt.applicationId}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-800 whitespace-nowrap">
                      {evt.action}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-600 text-[11px] max-w-md leading-relaxed">
                      {evt.description}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {getStatusBadge(evt.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center font-sans text-slate-500">
                    No audit records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
          Showing {filteredEvents.length} chronological audit records. All events are logged dynamically
          when reviewer actions are taken.
        </div>
      </div>
    </div>
  );
};
