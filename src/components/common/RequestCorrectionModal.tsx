import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface RequestCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  institutionName: string;
  onConfirm: (reason: string) => void;
  mode?: 'correction' | 'humanReview';
}

export const RequestCorrectionModal: React.FC<RequestCorrectionModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  institutionName,
  onConfirm,
  mode = 'correction',
}) => {
  const isCorrection = mode === 'correction';

  const commonReasons = isCorrection
    ? [
        'Discrepancy detected in land lease validity tenure (Clause 8). Certified revenue addendum required.',
        'Faculty Cadre roster has 8 assistant professor records without bank salary transfer vouchers.',
        'Building Structural Safety NOC has expired or requires renewal from municipal empanelled engineer.',
        'Endowment fund FDR receipt lacks required joint lien endorsement notation.',
      ]
    : [
        'Unusual edge compression artifact around Directorate seal and signature block requires physical stamp check.',
        'Cross-document mismatch between registered Trust charter name and current application portal disclosure.',
        'Conflicting land survey demarcation numbers between Municipal map and Revenue registry.',
      ];

  const [selectedPreset, setSelectedPreset] = useState(commonReasons[0]);
  const [customNote, setCustomNote] = useState('');

  const handleConfirm = () => {
    const finalReason = customNote.trim() ? `${selectedPreset} — Note: ${customNote.trim()}` : selectedPreset;
    onConfirm(finalReason);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCorrection ? 'Issue Deficiency Notice / Request Correction' : 'Escalate for Senior Regulatory Review'}
      subtitle={`Application: ${applicationId} • ${institutionName}`}
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isCorrection ? 'danger' : 'secondary'}
            onClick={handleConfirm}
            leftIcon={isCorrection ? <AlertTriangle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          >
            {isCorrection ? 'Dispatch Deficiency Notice' : 'Confirm Regulatory Escalation'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className={`p-3.5 rounded-lg border ${isCorrection ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-purple-50/80 border-purple-200 text-purple-900'}`}>
          <p className="text-xs font-medium leading-relaxed">
            {isCorrection
              ? 'This will update the application status to "Needs Correction", append an entry to the application review history, and simulate dispatching an official deficiency letter to the applicant.'
              : 'This will transition the application status to "Flagged for Human Review" and flag it for comprehensive multi-officer scrutiny in the Regulatory Review queue.'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Primary Ground / Reason
          </label>
          <div className="space-y-2">
            {commonReasons.map((reason, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedPreset === reason
                    ? 'border-blue-500 bg-blue-50/60 font-semibold text-blue-900 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="reason-preset"
                  checked={selectedPreset === reason}
                  onChange={() => setSelectedPreset(reason)}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="flex-1 leading-snug">{reason}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Additional Reviewer Observations (Optional)
          </label>
          <textarea
            rows={3}
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Provide specific clauses, dates, or institutional contact directives for this notice..."
            className="w-full p-2.5 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-slate-400"
          />
        </div>
      </div>
    </Modal>
  );
};
