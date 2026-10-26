import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnomalyFinding } from '../types';
import { FindingDetailModal } from '../components/anomalies/FindingDetailModal';
import { SearchInput } from '../components/common/SearchInput';
import { Button } from '../components/common/Button';
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Filter,
  ShieldAlert,
} from 'lucide-react';

export const AnomalyReview: React.FC = () => {
  const { findings } = useApp();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedFinding, setSelectedFinding] = useState<AnomalyFinding | null>(null);

  const filteredFindings = findings.filter((f: AnomalyFinding) => {
    const matchesSearch =
      f.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      f.applicationId.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.findingType.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase());

    const matchesPriority = priorityFilter === 'ALL' || f.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const totalCount = findings.length;
  const highCount = findings.filter((f: AnomalyFinding) => f.priority === 'High' && f.status !== 'Resolved').length;
  const medCount = findings.filter((f: AnomalyFinding) => f.priority === 'Medium' && f.status !== 'Resolved').length;
  const resolvedCount = findings.filter((f: AnomalyFinding) => f.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Anomaly Review & Discrepancy Scrutiny
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Investigate potential document inconsistencies, tenure mismatches, and image compression signals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Queue Status:</span>
          <span className="text-xs font-mono font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">
            {highCount + medCount} ACTIVE DISCREPANCIES
          </span>
        </div>
      </div>

      {/* Prominent Required Hackathon Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="text-amber-400 block mb-0.5 uppercase tracking-wider text-[11px]">
            Statutory Review Standard:
          </strong>
          &ldquo;Automated findings are preliminary indicators. They require human review and do not
          independently establish fraud or document authenticity.&rdquo;
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Findings
            </span>
            <AlertOctagon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-1">
            {totalCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Lifetime flagged items</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              High Priority
            </span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-600 mt-1">
            {highCount}
          </div>
          <span className="text-[11px] text-red-600/80 mt-1 block font-medium">
            Requires immediate inquiry
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Medium Priority
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 mt-1">
            {medCount}
          </div>
          <span className="text-[11px] text-amber-600/80 mt-1 block font-medium">
            Routine documentation check
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Resolved Findings
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 mt-1">
            {resolvedCount}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block font-medium">
            Substantiated or amended
          </span>
        </div>
      </div>

      {/* Main Findings Table */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/60">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search findings, institution, or description..."
            className="w-full md:w-80"
          />

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Review Statuses</option>
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Table Records */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="table-header border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Finding ID</th>
                <th className="py-3 px-4 font-semibold">Application & Institution</th>
                <th className="py-3 px-4 font-semibold">Target Document</th>
                <th className="py-3 px-4 font-semibold">Discrepancy Category</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Detected</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFindings.length > 0 ? (
                filteredFindings.map((finding: AnomalyFinding) => (
                  <tr
                    key={finding.id}
                    onClick={() => setSelectedFinding(finding)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                      {finding.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {finding.institutionName}
                      </div>
                      <span className="text-[11px] text-blue-600 font-mono font-semibold">
                        {finding.applicationId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{finding.documentName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {finding.findingType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block ${
                          finding.priority === 'High'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : finding.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {finding.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{finding.dateDetected}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          finding.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : finding.status === 'In Review'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {finding.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFinding(finding)}
                        className="py-1 px-2.5 text-xs font-semibold"
                      >
                        Investigate
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No anomaly findings match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
          Click any row to inspect side-by-side OCR evidence, document clauses, and resolution workflows.
        </div>
      </div>

      <FindingDetailModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />
    </div>
  );
};
