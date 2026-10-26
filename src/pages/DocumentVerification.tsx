import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentUploader } from '../components/documents/DocumentUploader';
import { DocumentPreview } from '../components/documents/DocumentPreview';
import { VerificationResults } from '../components/documents/VerificationResults';
import { DocumentRecord, ApplicationRecord } from '../types';
import { FileText, Trash2 } from 'lucide-react';

export const DocumentVerification: React.FC = () => {
  const {
    applications,
    selectedApplicationId,
    setSelectedApplicationId,
    addDocumentToApp,
    removeDocumentFromApp,
    runDemoVerificationForApp,
  } = useApp();

  const currentApp =
    applications.find((a: ApplicationRecord) => a.id === selectedApplicationId) || applications[0];

  const [selectedDocId, setSelectedDocId] = useState<string>(
    currentApp?.documents[0]?.id || ''
  );
  const [isScanning, setIsScanning] = useState(false);

  const activeDoc =
    currentApp?.documents.find((d: DocumentRecord) => d.id === selectedDocId) ||
    currentApp?.documents[0] ||
    ({
      id: 'DOC-FALLBACK',
      name: 'Registration_Certificate.pdf',
      category: 'Institutional Registration Certificate',
      fileSize: '2.4 MB',
      uploadDate: '2026-04-12',
      fileType: 'pdf',
      reviewStatus: 'Verified',
    } as DocumentRecord);

  const handleSelectApp = (appId: string) => {
    setSelectedApplicationId(appId);
    const targetApp = applications.find((a: ApplicationRecord) => a.id === appId);
    if (targetApp && targetApp.documents.length > 0) {
      setSelectedDocId(targetApp.documents[0].id);
    }
  };

  const handleRunVerification = async () => {
    setIsScanning(true);
    await runDemoVerificationForApp(currentApp.id);
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Application Selector & Header */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Verification Workspace
            </span>
            <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              {currentApp.id}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {currentApp.institutionName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentApp.district}, {currentApp.state} • {currentApp.type} • Status:{' '}
            <strong className="text-slate-800">{currentApp.verificationStatus}</strong>
          </p>
        </div>

        {/* Quick App Switcher */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <label className="text-xs font-semibold text-slate-600 shrink-0">Switch Application:</label>
          <select
            value={currentApp.id}
            onChange={(e) => handleSelectApp(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
          >
            {applications.map((app: ApplicationRecord) => (
              <option key={app.id} value={app.id}>
                {app.id} — {app.institutionName.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Uploader */}
      <DocumentUploader
        onUploadComplete={(newDoc) => {
          addDocumentToApp(currentApp.id, {
            ...newDoc,
            uploadDate: new Date().toISOString().split('T')[0],
            reviewStatus: 'Pending',
          });
        }}
      />

      {/* Submitted Documents Selector Table */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Attached Statutory Documents ({currentApp.documents.length})
            </h3>
            <p className="text-xs text-slate-500">
              Select a document to inspect preview and analyze extracted entities
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Active: <strong className="text-blue-600 font-mono">{activeDoc.name}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="table-header border-b border-slate-200">
                <th className="py-2.5 px-4 font-semibold">Document Name</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold">Size</th>
                <th className="py-2.5 px-4 font-semibold">Uploaded</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentApp.documents.map((doc: DocumentRecord) => {
                const isSelected = doc.id === activeDoc.id;
                return (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 font-semibold text-blue-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      <FileText
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate max-w-[240px]">{doc.name}</span>
                      {doc.anomalyFlag && (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded shrink-0">
                          Mismatch
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{doc.category}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{doc.fileSize}</td>
                    <td className="py-3 px-4 text-slate-500">{doc.uploadDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          doc.reviewStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.reviewStatus === 'Flagged'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {doc.reviewStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDocId(doc.id)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? 'Inspecting' : 'Inspect'}
                        </button>
                        {currentApp.documents.length > 1 && (
                          <button
                            onClick={() => removeDocumentFromApp(currentApp.id, doc.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            title="Remove document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split Inspection Canvas: Preview & Results */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="h-[620px]">
          <DocumentPreview document={activeDoc} isScanning={isScanning} />
        </div>

        <div className="h-full">
          <VerificationResults
            document={activeDoc}
            application={currentApp}
            onRunVerification={handleRunVerification}
            isScanning={isScanning}
          />
        </div>
      </div>
    </div>
  );
};
