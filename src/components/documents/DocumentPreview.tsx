import React, { useState } from 'react';
import { DocumentRecord } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Eye,
  FileText,
  Scan,
  ShieldCheck,
  AlertTriangle,
  Maximize2,
  Download,
} from 'lucide-react';
import { Button } from '../common/Button';

interface DocumentPreviewProps {
  document: DocumentRecord;
  isScanning?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, isScanning = false }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showOcrBoxes, setShowOcrBoxes] = useState(true);
  const [viewMode, setViewMode] = useState<'visual' | 'extracted'>('visual');

  const handleZoomIn = () => setZoom((z) => Math.min(180, z + 20));
  const handleZoomOut = () => setZoom((z) => Math.max(70, z - 20));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  return (
    <div className="bg-white rounded-xl border border-slate-200 card-shadow flex flex-col h-full overflow-hidden">
      {/* Viewer Header with Controls */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 truncate block">
              {document.name}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {document.category} • {document.fileSize}
            </span>
          </div>
        </div>

        {/* View Mode & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
                viewMode === 'visual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Document View
            </button>
            <button
              onClick={() => setViewMode('extracted')}
              className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
                viewMode === 'extracted' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              OCR Entities
            </button>
          </div>

          {/* OCR Highlights Toggle */}
          <button
            onClick={() => setShowOcrBoxes(!showOcrBoxes)}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              showOcrBoxes
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
            title="Toggle OCR entity bounding boxes"
          >
            <Scan className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OCR Boxes</span>
          </button>

          {/* Zoom & Rotate */}
          <div className="flex items-center gap-1 border-l border-slate-300 pl-2">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-600 w-8 text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
              title="Rotate 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-slate-100/90 p-4 sm:p-6 overflow-auto flex items-center justify-center min-h-[460px] relative">
        {/* Animated Scanner Laser Beam when verification is active */}
        {isScanning && <div className="animate-scanline z-30" />}

        {viewMode === 'visual' ? (
          <div
            className="transition-transform duration-200 origin-center bg-white border border-slate-300 shadow-xl rounded-sm p-8 sm:p-10 max-w-lg w-full relative select-none font-serif text-slate-900 leading-normal"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              minHeight: '520px',
            }}
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] text-5xl font-black font-sans uppercase rotate-[-35deg] tracking-widest text-slate-900">
              OFFICIAL ATTESTATION • NIRIKSHAK AI DEMO
            </div>

            {/* Document Header Emblem & Seal */}
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <div className="w-12 h-12 rounded-full border-2 border-slate-800 mx-auto mb-2 flex items-center justify-center font-bold text-slate-800 text-xs">
                सत्यमेव जयते
              </div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider font-sans text-slate-900">
                GOVERNMENT OF INDIA & REGIONAL REGULATORY BUREAU
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-slate-600 font-sans mt-0.5">
                DEPARTMENT OF TECHNICAL & HIGHER EDUCATION REGISTRATION
              </p>
            </div>

            {/* Document Title */}
            <div className="my-4 text-center">
              <span className="inline-block border-y border-slate-700 py-1 px-4 text-xs font-bold uppercase tracking-wide font-sans bg-slate-50">
                {document.category}
              </span>
            </div>

            {/* Document Body & Simulated Legal Text */}
            <div className="space-y-3 text-[11px] text-justify text-slate-800 font-serif leading-relaxed">
              <p>
                <strong>Dossier Reference:</strong>{' '}
                <span className="font-mono bg-blue-50 px-1 border border-blue-200 text-blue-900 font-semibold">
                  {document.extractedFields?.registrationNumber || 'REG-MP-2026/0841-A'}
                </span>
                <span className="float-right font-sans text-[10px] text-slate-500">
                  Execution Date: {document.extractedFields?.issueDate || '14-Aug-2022'}
                </span>
              </p>

              <p>
                THIS INDENTURE AND REGULATORY INSTRUMENT witnesses that the institution named{' '}
                <strong
                  className={`relative ${
                    showOcrBoxes ? 'bg-amber-100 ring-2 ring-amber-400 rounded px-1' : ''
                  }`}
                >
                  {document.extractedFields?.institutionName || 'Apex Institute of Technology & Management'}
                  {showOcrBoxes && (
                    <span className="absolute -top-3.5 left-0 text-[8px] font-sans font-bold bg-amber-600 text-white px-1 rounded">
                      ENTITY: ORG
                    </span>
                  )}
                </strong>
                , situated in the jurisdiction of Bhopal, Madhya Pradesh, has presented this statutory
                record for institutional affiliation accreditation under the statutory regulatory norms.
              </p>

              <div
                className={`p-2.5 rounded border border-slate-300 bg-slate-50 font-sans text-[10px] space-y-1 relative ${
                  document.anomalyFlag && showOcrBoxes ? 'ring-2 ring-red-500 bg-red-50/50' : ''
                }`}
              >
                {document.anomalyFlag && showOcrBoxes && (
                  <span className="absolute -top-3 right-2 text-[8px] font-bold bg-red-600 text-white px-1.5 py-0.2 rounded uppercase">
                    OCR Mismatch Flagged
                  </span>
                )}
                <div>
                  <strong>Tenure / Validity Period:</strong>{' '}
                  <span className="font-mono font-bold text-slate-900">
                    {document.extractedFields?.validTill || 'Permanent (Societies Act)'}
                  </span>
                </div>
                {document.extractedFields?.landAreaAcres && (
                  <div>
                    <strong>Total Contiguous Land Parcel:</strong>{' '}
                    <span className="font-mono font-bold text-slate-900">
                      {document.extractedFields.landAreaAcres}
                    </span>
                  </div>
                )}
                {document.extractedFields?.facultyCount && (
                  <div>
                    <strong>Total Approved Cadre:</strong>{' '}
                    <span className="font-mono font-bold text-slate-900">
                      {document.extractedFields.facultyCount} Faculty Members
                    </span>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-slate-600 italic">
                It is certified that the representations made in this schedule correspond with the original
                revenue registers and municipal clearances deposited under regulatory oversight.
              </p>
            </div>

            {/* Bottom Stamps & Signatures */}
            <div className="mt-8 pt-4 border-t border-slate-300 flex items-end justify-between font-sans text-[10px]">
              {/* Official Seal Stamp */}
              <div
                className={`w-18 h-18 rounded-full border-2 border-dashed border-blue-700/80 flex flex-col items-center justify-center text-center p-1 text-[8px] font-bold text-blue-900 uppercase rotate-[-8deg] relative ${
                  showOcrBoxes ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                {showOcrBoxes && (
                  <span className="absolute -top-3 left-0 text-[7px] bg-blue-700 text-white px-1 rounded">
                    SEAL DETECTED
                  </span>
                )}
                <span>REGISTRAR SEAL</span>
                <span className="font-mono text-[7px]">VERIFIED</span>
                <span>STATE GOVT</span>
              </div>

              {/* Signatory Box */}
              <div className="text-right space-y-1">
                <div className="font-serif italic text-slate-600 font-bold text-xs">
                  {document.extractedFields?.signatoryAuthority || 'Authorized Signatory'}
                </div>
                <div className="w-28 border-b border-slate-700 ml-auto" />
                <div className="text-[9px] text-slate-500 font-sans uppercase tracking-wider font-semibold">
                  Competent Regulatory Authority
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Extracted OCR Key-Value Tab */
          <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-lg w-full shadow-lg text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">Extracted Key-Value Entities (OCR)</span>
              <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                CONFIDENCE: 98.4%
              </span>
            </div>

            <div className="divide-y divide-slate-100 font-mono text-[11px]">
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">entity.institution_name</span>
                <span className="font-bold text-slate-900 text-right">
                  {document.extractedFields?.institutionName || 'Apex Institute of Technology & Management'}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">entity.registration_number</span>
                <span className="font-bold text-blue-600">
                  {document.extractedFields?.registrationNumber || 'REG-MP-2026/0841-A'}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">entity.issue_date</span>
                <span className="text-slate-800">
                  {document.extractedFields?.issueDate || '2012-08-14'}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">entity.valid_till</span>
                <span className={`font-bold ${document.anomalyFlag ? 'text-red-600' : 'text-slate-800'}`}>
                  {document.extractedFields?.validTill || 'Permanent (Societies Act)'}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">entity.signatory_authority</span>
                <span className="text-slate-800">
                  {document.extractedFields?.signatoryAuthority || 'Sub-Registrar, Revenue Authority'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
              <strong>Engine Note:</strong> Raw token stream tokenized via optical character
              recognition with bounding-box geometry matching. All entities cross-indexed with application
              master registry.
            </div>
          </div>
        )}
      </div>

      {/* Preview Footer Strip */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-4">
        <span>File: <strong className="text-slate-700">{document.name}</strong></span>
        <span className="text-[10px] text-slate-400">
          Inspection Mode: High-Fidelity Vector & OCR Rendering
        </span>
      </div>
    </div>
  );
};
