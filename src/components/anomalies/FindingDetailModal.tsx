import React, { useState } from 'react';
import { AnomalyFinding } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  AlertOctagon,
  FileText,
  Building2,
  CheckCircle2,
  Eye,
  Send,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FindingDetailModalProps {
  finding: AnomalyFinding | null;
  onClose: () => void;
}

export const FindingDetailModal: React.FC<FindingDetailModalProps> = ({ finding, onClose }) => {
  const navigate = useNavigate();
  const { markFindingReviewed, resolveFinding, setSelectedApplicationId } = useApp();

  const [reviewerNote, setReviewerNote] = useState('');
  const [resolutionJustification, setResolutionJustification] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  if (!finding) return null;

  const handleMarkReviewed = () => {
    markFindingReviewed(finding.id, reviewerNote);
    onClose();
  };

  const handleResolve = () => {
    const finalNote = resolutionJustification.trim()
      ? resolutionJustification.trim()
      : 'Resolved after cross-referencing certified administrative addendum.';
    resolveFinding(finding.id, finalNote);
    setIsResolving(false);
    onClose();
  };

  const handleInspectApplication = () => {
    setSelectedApplicationId(finding.applicationId);
    onClose();
    navigate('/applications');
  };

  return (
    <Modal
      isOpen={!!finding}
      onClose={onClose}
      title={`Investigate Finding: ${finding.id}`}
      subtitle={`${finding.findingType} • Priority: ${finding.priority}`}
      maxWidth="xl"
      footer={
        <div className="flex flex-wrap items-center justify-between w-full gap-2">
          <Button variant="ghost" size="sm" onClick={handleInspectApplication}>
            Open Application Dossier <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {finding.status !== 'In Review' && finding.status !== 'Resolved' && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Eye className="w-4 h-4 text-blue-600" />}
                onClick={handleMarkReviewed}
              >
                Mark In Review
              </Button>
            )}
            {finding.status !== 'Resolved' && (
              <Button
                variant="success"
                size="sm"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => setIsResolving(true)}
              >
                Resolve Finding
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Status & Priority Badge Strip */}
        <div className="flex flex-wrap items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Priority:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded uppercase tracking-wider text-[10px] ${
                finding.priority === 'High'
                  ? 'bg-red-100 text-red-800'
                  : finding.priority === 'Medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {finding.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Review Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                finding.status === 'Resolved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : finding.status === 'In Review'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {finding.status}
            </span>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            Detected: {finding.dateDetected}
          </div>
        </div>

        {/* Institution & Document Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Target Institution
            </span>
            <p className="font-bold text-slate-900">{finding.institutionName}</p>
            <span className="text-blue-600 font-mono text-[11px] font-semibold">
              {finding.applicationId}
            </span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Subject Document
            </span>
            <p className="font-bold text-slate-900 truncate">{finding.documentName}</p>
            <span className="text-slate-500 text-[11px]">Category: Statutory Evidence</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Discrepancy Description
          </label>
          <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg text-slate-800 leading-relaxed font-medium">
            {finding.description}
          </div>
        </div>

        {/* Evidence Comparison Box */}
        <div>
          <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Extracted Evidence vs Statutory Baseline
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block font-semibold mb-1">
                Value Detected in Document:
              </span>
              <p className="font-mono font-bold text-red-600 bg-white p-2 rounded border border-red-100">
                {finding.evidence.valueInDoc}
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block font-semibold mb-1">
                Expected Statutory Value / Form Declaration:
              </span>
              <p className="font-mono font-bold text-emerald-700 bg-white p-2 rounded border border-emerald-100">
                {finding.evidence.expectedValue}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 italic">
            <strong>Analysis:</strong> {finding.evidence.comparisonNote}
          </p>
        </div>

        {/* Why Raised & Recommended Step */}
        <div className="space-y-2">
          <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-lg">
            <span className="font-bold text-blue-950 block mb-0.5">Why was this finding raised?</span>
            <p className="text-blue-900 text-[11px] leading-relaxed">{finding.whyRaised}</p>
          </div>

          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-lg">
            <span className="font-bold text-emerald-950 block mb-0.5">
              Recommended Regulatory Step:
            </span>
            <p className="text-emerald-900 text-[11px] leading-relaxed">
              {finding.recommendedAction}
            </p>
          </div>
        </div>

        {/* Reviewer Notes Field */}
        <div>
          <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Reviewer Investigation Notes
          </label>
          <textarea
            rows={2}
            value={reviewerNote || finding.reviewerNotes || ''}
            onChange={(e) => setReviewerNote(e.target.value)}
            placeholder="Document phone contact, deficiency notice dispatch, or verification rationale..."
            className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        {/* Resolution Prompt if user clicked Resolve */}
        {isResolving && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg space-y-2 animate-in fade-in">
            <span className="font-bold text-emerald-900 block text-xs">
              Confirm Finding Resolution
            </span>
            <input
              type="text"
              value={resolutionJustification}
              onChange={(e) => setResolutionJustification(e.target.value)}
              placeholder="State resolution justification (e.g. Registered addendum received & validated)..."
              className="w-full p-2 border border-emerald-300 rounded text-xs bg-white"
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setIsResolving(false)}>
                Cancel
              </Button>
              <Button variant="success" size="sm" onClick={handleResolve}>
                Confirm & Mark Resolved
              </Button>
            </div>
          </div>
        )}

        {/* Mandated SIH Disclaimer */}
        <div className="p-2.5 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-600">
          <strong>Reviewer Principle:</strong> Automated findings are preliminary indicators. They
          require human review and do not independently establish fraud or document authenticity.
        </div>
      </div>
    </Modal>
  );
};
