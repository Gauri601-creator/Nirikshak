import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComplianceRuleCard } from '../components/compliance/ComplianceRuleCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ComplianceRule } from '../types';
import {
  ShieldCheck,
  Play,
  Plus,
  AlertTriangle,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

export const ComplianceChecks: React.FC = () => {
  const { complianceRules, runAllComplianceChecks, addCustomRule } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isRunning, setIsRunning] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<ComplianceRule['category']>('Statutory Approvals');
  const [newRuleDescription, setNewRuleDescription] = useState('');
  const [newRuleRef, setNewRuleRef] = useState('Regulatory Handbook 2026, Cl. 4.1');

  const filteredRules = complianceRules.filter((r: ComplianceRule) => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const passedCount = complianceRules.filter((r: ComplianceRule) => r.status === 'Passed').length;
  const reviewCount = complianceRules.filter((r: ComplianceRule) => r.status === 'Needs Review').length;
  const failedCount = complianceRules.filter((r: ComplianceRule) => r.status === 'Failed Check').length;

  const handleRunAll = async () => {
    setIsRunning(true);
    await runAllComplianceChecks();
    setIsRunning(false);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRuleDescription.trim()) return;

    addCustomRule({
      name: newRuleName.trim(),
      category: newRuleCategory,
      description: newRuleDescription.trim(),
      status: 'Needs Review',
      relatedDocument: 'Master Application',
      findingDetails: 'Preliminary demonstration evaluation pending reviewer verification.',
      regulatoryReference: newRuleRef,
    });

    setNewRuleName('');
    setNewRuleDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Regulatory Compliance Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated verification against institutional guidelines, statutory norms, and affiliation criteria.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-4 h-4 text-slate-500" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Demo Rule
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isRunning}
            leftIcon={<Play className="w-4 h-4" />}
            onClick={handleRunAll}
          >
            Run Demo Checks
          </Button>
        </div>
      </div>

      {/* Critical Mandatory AICTE Regulatory Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed space-y-1">
          <p className="font-bold text-amber-950">
            Demonstration Protocol Disclaimer:
          </p>
          <p>
            The regulatory checks presented below are <strong>illustrative demonstration rules</strong> designed
            to showcase automated rule validation architecture. They do not constitute official AICTE regulations
            or legal mandates until configured and validated against statutory bureau policies.
          </p>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 card-shadow flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Rules
            </span>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-0.5">
              {complianceRules.length}
            </div>
          </div>
          <ShieldCheck className="w-7 h-7 text-blue-600 bg-blue-50 p-1.5 rounded-lg" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 card-shadow flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Passed Checks
            </span>
            <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-0.5">
              {passedCount}
            </div>
          </div>
          <CheckCircle2 className="w-7 h-7 text-emerald-600 bg-emerald-50 p-1.5 rounded-lg" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 card-shadow flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Needs Review
            </span>
            <div className="text-2xl font-extrabold font-mono text-amber-600 mt-0.5">
              {reviewCount}
            </div>
          </div>
          <Clock className="w-7 h-7 text-amber-600 bg-amber-50 p-1.5 rounded-lg" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 card-shadow flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Failed Checks
            </span>
            <div className="text-2xl font-extrabold font-mono text-red-600 mt-0.5">
              {failedCount}
            </div>
          </div>
          <XCircle className="w-7 h-7 text-red-600 bg-red-50 p-1.5 rounded-lg" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 card-shadow">
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'Passed', 'Needs Review', 'Failed Check'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st === 'ALL' ? 'All Rules' : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Rule Categories</option>
            <option value="Mandatory Documents">Mandatory Documents</option>
            <option value="Cadre & Infrastructure">Cadre & Infrastructure</option>
            <option value="Statutory Approvals">Statutory Approvals</option>
            <option value="Institutional Integrity">Institutional Integrity</option>
            <option value="Financial Soundness">Financial Soundness</option>
          </select>
        </div>
      </div>

      {/* Compliance Rule Cards List */}
      <div className="space-y-4">
        {filteredRules.length > 0 ? (
          filteredRules.map((rule: ComplianceRule) => (
            <ComplianceRuleCard key={rule.id} rule={rule} />
          ))
        ) : (
          <div className="bg-white p-10 rounded-xl border border-slate-200 text-center text-slate-500">
            No compliance rules match the selected filters.
          </div>
        )}
      </div>

      {/* Add Custom Rule Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Configure Demonstration Compliance Rule"
        subtitle="Add a customized validation logic to test dynamic regulatory scrutiny."
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateRule}>
              Save Rule
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Rule Title *
            </label>
            <input
              type="text"
              required
              value={newRuleName}
              onChange={(e) => setNewRuleName(e.target.value)}
              placeholder="e.g. Continuous CCTV Security Coverage in Examination Vaults"
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Rule Category
            </label>
            <select
              value={newRuleCategory}
              onChange={(e) => setNewRuleCategory(e.target.value as ComplianceRule['category'])}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
            >
              <option value="Mandatory Documents">Mandatory Documents</option>
              <option value="Cadre & Infrastructure">Cadre & Infrastructure</option>
              <option value="Statutory Approvals">Statutory Approvals</option>
              <option value="Institutional Integrity">Institutional Integrity</option>
              <option value="Financial Soundness">Financial Soundness</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description & Verification Criterion *
            </label>
            <textarea
              rows={3}
              required
              value={newRuleDescription}
              onChange={(e) => setNewRuleDescription(e.target.value)}
              placeholder="Describe the verification parameter and expected statutory proof..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Statutory Reference
            </label>
            <input
              type="text"
              value={newRuleRef}
              onChange={(e) => setNewRuleRef(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg text-slate-800 font-mono"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
