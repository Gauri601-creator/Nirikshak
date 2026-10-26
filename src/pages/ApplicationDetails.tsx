import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationRecord } from '../types';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RequestCorrectionModal } from '../components/common/RequestCorrectionModal';
import {
  ArrowLeft,
  FileCheck2,
  Play,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Clock,
  Building2,
  MapPin,
  Calendar,
  Save,
  AlertOctagon,
} from 'lucide-react';

interface ApplicationDetailsProps {
  application: ApplicationRecord;
  onBack: () => void;
}

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ application, onBack }) => {
  const navigate = useNavigate();
  const {
    runDemoVerificationForApp,
    requestCorrection,
    markForHumanReview,
    approveApplication,
    updateApplicationNotes,
    setSelectedApplicationId,
    findings,
  } = useApp();

  const [notes, setNotes] = useState(application.reviewerNotes);
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isHumanReviewModalOpen, setIsHumanReviewModalOpen] = useState(false);

  const appFindings = findings.filter((f) => f.applicationId === application.id);

  const handleRunChecks = async () => {
    setIsRunningChecks(true);
    await runDemoVerificationForApp(application.id);
    setIsRunningChecks(false);
  };

  const handleViewDocuments = () => {
    setSelectedApplicationId(application.id);
    navigate('/documents');
  };

  const handleSaveNotes = () => {
    updateApplicationNotes(application.id, notes);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Applications List
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Assigned Officer:</span>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full">
            {application.assignedOfficer}
          </span>
        </div>
      </div>

      {/* Hero Application Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {application.id}
              </span>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {application.institutionCode}
              </span>
              {application.verificationStatus === 'Verified' && (
                <Badge variant="success" dot>Verified Compliant</Badge>
              )}
              {application.verificationStatus === 'Pending Review' && (
                <Badge variant="info" dot>Pending Review</Badge>
              )}
              {application.verificationStatus === 'Needs Correction' && (
                <Badge variant="warning" dot>Needs Correction</Badge>
              )}
              {application.verificationStatus === 'Flagged for Human Review' && (
                <Badge variant="danger" dot>Flagged for Human Review</Badge>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {application.institutionName}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Building2 className="w-4 h-4 text-slate-400" />
                {application.type}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {application.district}, {application.state}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Submitted: {application.submissionDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Updated: {application.lastUpdated}
              </span>
            </div>
          </div>

          {/* Compliance Progress Pill */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-w-[220px] text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Regulatory Compliance
            </span>
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {application.complianceScore}%
              </span>
              <span className="text-xs font-semibold text-slate-500">Score</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  application.complianceScore >= 80
                    ? 'bg-emerald-500'
                    : application.complianceScore >= 60
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${application.complianceScore}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Status: <strong className="text-slate-800">{application.complianceStatus}</strong>
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FileCheck2 className="w-4 h-4" />}
              onClick={handleViewDocuments}
            >
              View Submitted Documents ({application.documentsCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              isLoading={isRunningChecks}
              leftIcon={<Play className="w-4 h-4 text-blue-600" />}
              onClick={handleRunChecks}
            >
              Run Demo Checks
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
              onClick={() => setIsCorrectionModalOpen(true)}
              className="text-amber-800 hover:bg-amber-50 border-amber-300"
            >
              Request Correction
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ShieldAlert className="w-4 h-4 text-red-600" />}
              onClick={() => setIsHumanReviewModalOpen(true)}
              className="text-red-800 hover:bg-red-50 border-red-300"
            >
              Mark for Human Review
            </Button>
            <Button
              variant="success"
              size="sm"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => approveApplication(application.id)}
            >
              Approve Application
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Submitted Statutory Documents</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Uploaded institutional certificates and inspection evidence
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleViewDocuments}>
                Open Workspace <FileCheck2 className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="divide-y divide-slate-100">
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                        {doc.anomalyFlag && (
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                            Discrepancy Detected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Category: <span className="text-slate-700">{doc.category}</span> • {doc.fileSize}
                      </p>
                      {doc.anomalyNote && (
                        <p className="text-[11px] text-red-600 bg-red-50/70 p-1.5 rounded mt-1.5 border border-red-200/60 font-medium">
                          <strong>Finding:</strong> {doc.anomalyNote}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        doc.reviewStatus === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : doc.reviewStatus === 'Flagged'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {doc.reviewStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Findings on this Application */}
          <div className="bg-white rounded-xl border border-slate-200 card-shadow p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Regulatory Findings & Discrepancies ({appFindings.length})
                </h3>
              </div>
              <button
                onClick={() => navigate('/anomalies')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Anomaly Review Queue &rarr;
              </button>
            </div>

            {appFindings.length > 0 ? (
              <div className="space-y-3 mt-3">
                {appFindings.map((finding) => (
                  <div
                    key={finding.id}
                    className="p-3.5 rounded-lg border border-red-200 bg-red-50/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-red-700">{finding.id}</span>
                        <span className="font-semibold text-slate-800">{finding.findingType}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          finding.priority === 'High'
                            ? 'bg-red-200 text-red-900'
                            : 'bg-amber-200 text-amber-900'
                        }`}
                      >
                        {finding.priority} Priority
                      </span>
                    </div>

                    <p className="text-slate-700 font-medium leading-relaxed">
                      {finding.description}
                    </p>

                    <div className="bg-white p-2 rounded border border-red-100 text-[11px] text-slate-600">
                      <strong>Document Comparison:</strong> {finding.evidence.valueInDoc} vs Expected:{' '}
                      {finding.evidence.expectedValue}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      <span>Status: <strong className="text-slate-800">{finding.status}</strong></span>
                      <button
                        onClick={() => navigate('/anomalies')}
                        className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        Investigate Finding &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                <p className="font-semibold text-slate-800">No Open Discrepancies</p>
                <p className="text-[11px] text-slate-400">
                  This application has no unresolved anomaly indicators.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reviewer Notes & Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 card-shadow p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Official Reviewer Notes</h3>
              <span className="text-[10px] font-mono text-slate-400">INTERNAL ONLY</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Observations and directives recorded by the regulatory scrutiny team.
            </p>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record official notes, legal citations, or deficiency directives..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-3 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Save className="w-3.5 h-3.5" />}
                onClick={handleSaveNotes}
              >
                Save Notes
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 card-shadow p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Audit & Review History
            </h3>

            <div className="relative pl-5 border-l-2 border-blue-200 space-y-4">
              {application.reviewHistory.map((item) => (
                <div key={item.id} className="relative text-xs">
                  <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-slate-700">{item.author}</span>
                    <span className="font-mono">{item.date}</span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs">{item.action}</p>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RequestCorrectionModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        applicationId={application.id}
        institutionName={application.institutionName}
        mode="correction"
        onConfirm={(reason) => requestCorrection(application.id, reason)}
      />

      <RequestCorrectionModal
        isOpen={isHumanReviewModalOpen}
        onClose={() => setIsHumanReviewModalOpen(false)}
        applicationId={application.id}
        institutionName={application.institutionName}
        mode="humanReview"
        onConfirm={(reason) => markForHumanReview(application.id, reason)}
      />
    </div>
  );
};
