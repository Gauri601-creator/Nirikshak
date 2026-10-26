import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, FileText } from 'lucide-react';
import { DocumentCategory } from '../../types';
import { Button } from '../common/Button';

interface DocumentUploaderProps {
  onUploadComplete: (doc: {
    name: string;
    category: DocumentCategory;
    fileSize: string;
    fileType: 'pdf' | 'png' | 'jpg' | 'jpeg';
    fileUrl?: string;
  }) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>(
    'Institutional Registration Certificate'
  );
  const [uploadingFile, setUploadingFile] = useState<{
    name: string;
    size: string;
    type: 'pdf' | 'png' | 'jpg' | 'jpeg';
    progress: number;
    url?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories: DocumentCategory[] = [
    'Institutional Registration Certificate',
    'Land & Infrastructure Report',
    'Faculty & Staff Cadre List',
    'Financial Audited Statement',
    'Fire Safety & Building Approval NOC',
    'State Directorate NOC',
    'Affiliation Recommendation Letter',
  ];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const file = files[0];

    // Validate extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['pdf', 'png', 'jpg', 'jpeg'].includes(ext)) {
      setError('Unsupported file type. Only PDF, PNG, JPG, and JPEG documents are permitted.');
      return;
    }

    // Validate size (max 10MB)
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 10) {
      setError(`File size exceeds 10 MB limit (${sizeInMB.toFixed(1)} MB). Please upload a compressed copy.`);
      return;
    }

    const sizeFormatted = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
    const objectUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;

    setUploadingFile({
      name: file.name,
      size: sizeFormatted,
      type: ext as 'pdf' | 'png' | 'jpg' | 'jpeg',
      progress: 10,
      url: objectUrl,
    });

    // Simulate progress
    const interval = setInterval(() => {
      setUploadingFile((prev) => {
        if (!prev) {
          clearInterval(interval);
          return null;
        }
        if (prev.progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onUploadComplete({
              name: prev.name,
              category: selectedCategory,
              fileSize: prev.size,
              fileType: prev.type,
              fileUrl: prev.url,
            });
            setUploadingFile(null);
          }, 300);
          return { ...prev, progress: 100 };
        }
        return { ...prev, progress: prev.progress + 25 };
      });
    }, 200);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 card-shadow p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Upload Institutional Document</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Attach verified regulatory certificates for automated OCR & authenticity inspection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 shrink-0">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-blue-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-4 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-bold text-slate-800">
          Click to upload or drag & drop document
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Supported file formats: <strong className="text-slate-700">PDF, PNG, JPG, JPEG</strong> (Max file size: 10 MB)
        </p>
        <p className="text-[10px] text-slate-400 mt-2 font-mono">
          Security Enforced: Safe client-side ingestion • No script execution
        </p>
      </div>

      {/* Validation Error Alert */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Simulated Upload Progress Bar */}
      {uploadingFile && (
        <div className="mt-3 p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">{uploadingFile.name}</span>
              <span className="text-[10px] text-slate-500 font-mono">({uploadingFile.size})</span>
            </div>
            <span className="font-mono font-bold text-blue-600">{uploadingFile.progress}%</span>
          </div>
          <div className="w-full bg-blue-200/60 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-200"
              style={{ width: `${uploadingFile.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
