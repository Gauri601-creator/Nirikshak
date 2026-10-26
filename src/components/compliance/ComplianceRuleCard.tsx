import React, { useState } from 'react';
import { ComplianceRule } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Edit3,
} from 'lucide-react';

interface ComplianceRuleCardProps {
  rule: ComplianceRule;
}

export const ComplianceRuleCard: React.FC<ComplianceRuleCardProps> = ({ rule }) => {
  const { updateComplianceRule } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState<ComplianceRule['status']>(rule.status);
  const [customFinding, setCustomFinding] = useState(rule.findingDetails);
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadge = (status: ComplianceRule['status']) => {
    switch (status) {
      case 'Passed':
        return (
          <Badge variant="success" dot>
            Passed Check
          </Badge>
        );
      case 'Needs Review':
        return (
          <Badge variant="warning" dot>
            Needs Review
          </Badge>
        );
      case 'Failed Check':
        return (
          <Badge variant="danger" dot>
            Failed Check
          </Badge>
        );
      case 'Not Evaluated':
      default:
        return <Badge variant="neutral">Not Evaluated</Badge>;
    }
  };

  const getStatusBorder = (status: ComplianceRule['status']) => {
    switch (status) {
      case 'Passed':
        return 'border-l-4 border-l-emerald-500';
      case 'Needs Review':
        return 'border-l-4 border-l-amber-500';
      case 'Failed Check':
        return 'border-l-4 border-l-red-500';
      default:
        return 'border-l-4 border-l-slate-300';
    }
  };

  const handleSaveOverride = () => {
    updateComplianceRule(rule.id, overrideStatus, customFinding);
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden transition-all ${getStatusBorder(
        rule.status
      )}`}
    >
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {rule.id}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {rule.category}
            </span>
            {rule.isCustom && (
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                Custom Rule
              </span>
            )}
            <div>{getStatusBadge(rule.status)}</div>
          </div>

          <h3 className="text-base font-bold text-slate-900">{rule.name}</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rule.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Related: <strong>{rule.relatedDocument}</strong>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Ref: {rule.regulatoryReference}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            rightIcon={
              isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )
            }
            className="text-xs font-semibold"
          >
            {isExpanded ? 'Hide Details' : 'View Evidence'}
          </Button>
        </div>
      </div>

      {/* Expandable Evidence & Findings Panel */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200 text-xs space-y-3 animate-in fade-in duration-150">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Inspection Finding & Analysis
            </span>
            <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 font-medium leading-relaxed">
              {rule.findingDetails}
            </p>
          </div>

          {rule.evidenceSnippet && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Extracted Document Excerpt / Legal Evidence
              </span>
              <div className="bg-slate-900 text-amber-300 font-mono text-[11px] p-3 rounded-lg border border-slate-700 leading-relaxed overflow-x-auto">
                {rule.evidenceSnippet}
              </div>
            </div>
          )}

          {/* Reviewer Manual Override Box */}
          <div className="pt-2 border-t border-slate-200">
            {!isEditing ? (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Regulatory Scrutiny Override: Active rule outcome can be manually updated by the
                  reviewer.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={() => setIsEditing(true)}
                  className="py-1 px-2.5 text-xs"
                >
                  Override Status
                </Button>
              </div>
            ) : (
              <div className="space-y-3 p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">
                    Manual Reviewer Scrutiny Override
                  </span>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-xs font-semibold text-slate-700">Set Status:</label>
                  <select
                    value={overrideStatus}
                    onChange={(e) =>
                      setOverrideStatus(e.target.value as ComplianceRule['status'])
                    }
                    className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-white font-semibold text-slate-800"
                  >
                    <option value="Passed">Passed Check</option>
                    <option value="Needs Review">Needs Review</option>
                    <option value="Failed Check">Failed Check</option>
                    <option value="Not Evaluated">Not Evaluated</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Reviewer Justification Note:
                  </label>
                  <input
                    type="text"
                    value={customFinding}
                    onChange={(e) => setCustomFinding(e.target.value)}
                    placeholder="Enter official justification for status override..."
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSaveOverride}>
                    Apply Override
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
