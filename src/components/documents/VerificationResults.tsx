import React, { useState } from 'react';
import { DocumentRecord, ApplicationRecord } from '../../types';
import { Button } from '../common/Button';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  Scan,
  AlertOctagon,
  FileCheck,
} from 'lucide-react';

interface VerificationResultsProps {
  document: DocumentRecord;
  application: ApplicationRecord;
  onRunVerification: () => Promise<void>;
  isScanning: boolean;
}

export const VerificationResults: React.FC<VerificationResultsProps> = ({
  document,
  application,
  onRunVerification,
  isScanning,
}) => {
  const [pipelineStep, setPipelineStep] = useState<string>('Ready for analysis');
  const [hasRun, setHasRun] = useState(true);

  const handleTrigger = async () => {
    setPipelineStep('1/4: Running OCR Text Extraction...');
    setTimeout(() => setPipelineStep('2/4: Validating Mandatory Statutory Fields...'), 350);
    setTimeout(() => setPipelineStep('3/4: Cross-Referencing Application Dossier...'), 700);
    setTimeout(() => setPipelineStep('4/4: Performing Compression & Image Forensic Scan...'), 1050);

    await onRunVerification();
    setHasRun(true);
    setPipelineStep('Analysis Complete • Preliminary Findings Ready');
  };

  const isLandDeed = document.category === 'Land & Infrastructure Report';
  const isFacultyList = document.category === 'Faculty & Staff Cadre List';

  return (
    <div className="bg-white rounded-xl border border-slate-200 card-shadow p-5 flex flex-col h-full space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Verification Engine Results</h3>
            <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              PIPELINE v2.6
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated entity validation, expiry monitoring, and cross-document discrepancy screening
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isScanning}
          leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
          onClick={handleTrigger}
          className="shrink-0 font-bold"
        >
          {isScanning ? 'Running Inspection...' : 'Run Demo Verification'}
        </Button>
      </div>

      {/* Live Pipeline Execution Status Banner */}
      {isScanning && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between font-semibold text-blue-900">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 animate-spin text-blue-600" />
              <span>{pipelineStep}</span>
            </div>
            <span className="font-mono text-blue-600">Simulating pipeline</span>
          </div>
          <div className="w-full bg-blue-200/80 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Six Clearly Labeled Verification Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 flex-1">
        {/* 1. Text Extraction */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileSearch className="w-4 h-4 text-blue-600" />
              1. Text Extraction (OCR)
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              98.4% Confidence
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            All text tokens successfully parsed into UTF-8. Key entities identified:{' '}
            <strong className="text-slate-800">
              {document.extractedFields?.institutionName || application.institutionName}
            </strong>
            .
          </p>
          <div className="text-[10px] text-slate-500 font-mono">
            Registration: {document.extractedFields?.registrationNumber || 'AICTE-REG-2026-OK'}
          </div>
        </div>

        {/* 2. Required Fields Presence */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              2. Required Fields
            </span>
            {isFacultyList ? (
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                1 Missing Voucher
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                All 6 Mandatory Present
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {isFacultyList
              ? 'Warning: 8 Assistant Professor salary bank disbursement slips are missing.'
              : 'Mandatory statutory attributes (Authority, Stamp, Plot Survey No, Date) detected.'}
          </p>
          <div className="text-[10px] text-slate-500">
            Field check: Authority Signatory • Seal Matrix • Reference Code
          </div>
        </div>

        {/* 3. Document Expiry & Tenure */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              3. Document Expiry
            </span>
            {document.anomalyFlag && isLandDeed ? (
              <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                Tenure Shortfall
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                Active & Valid
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {isLandDeed
              ? 'Deed lease validity clause records expiration on 14-May-2028 (Tenure: 10 yrs, requires >= 30 yrs).'
              : 'Validity parameters are current and unexpired for the 2026-27 statutory inspection cycle.'}
          </p>
          <div className="text-[10px] text-slate-500 font-mono">
            Expiry: {document.extractedFields?.validTill || 'Permanent (Societies Act)'}
          </div>
        </div>

        {/* 4. Cross-Document Consistency */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              4. Cross-Document Consistency
            </span>
            {document.anomalyFlag ? (
              <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                Discrepancy Flagged
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                Consistent Across Files
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {document.anomalyNote ||
              'Entity titles, AISHE code, and institutional plot registration numbers match cross-referenced files.'}
          </p>
          <div className="text-[10px] text-slate-500">
            Cross-matched against: Master Application & Revenue Title Deed
          </div>
        </div>

        {/* 5. Possible Image Manipulation / Forensic Screening */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              5. Possible Image Manipulation
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
              Standard Compression
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Error Level Analysis (ELA) and DCT quantization indicate uniform compression. No localized
            stamp splice detected on this file.
          </p>
          <div className="text-[10px] text-slate-500 font-mono">
            Forensic Integrity Score: 94/100 (Normal Artifact Baseline)
          </div>
        </div>

        {/* 6. Verification Source Status */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              6. Verification Source Status
            </span>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
              Simulated Registry OK
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Simulated State Registrar Registry check returned matching Society registration record.
            Official seal pattern recognized.
          </p>
          <div className="text-[10px] text-slate-500">
            Source: MP State Society & Trust Directorate (Simulated Demo Query)
          </div>
        </div>
      </div>

      {/* Prominent Demo Notice */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Mandatory Notice:</strong> Automated verification findings and forensic scores are
          demonstration indicators. They assist reviewers by flagging
          inconsistencies for human review and do not independently establish fraud or statutory
          forgery.
        </div>
      </div>
    </div>
  );
};
