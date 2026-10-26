import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  HelpCircle,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface TopbarProps {
  onOpenMobileSidebar: () => void;
  onOpenNewApplication: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileSidebar, onOpenNewApplication }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, auditEvents, applications, setSelectedApplicationId } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Derive breadcrumb and title from pathname
  const path = location.pathname;
  let pageTitle = 'Overview Dashboard';
  let breadcrumb = 'Overview';

  if (path.startsWith('/applications')) {
    pageTitle = 'Applications Dossier Management';
    breadcrumb = 'Applications';
  } else if (path.startsWith('/documents')) {
    pageTitle = 'Document Verification Workspace';
    breadcrumb = 'Document Verification';
  } else if (path.startsWith('/compliance')) {
    pageTitle = 'Regulatory Compliance Checks';
    breadcrumb = 'Compliance Checks';
  } else if (path.startsWith('/anomalies')) {
    pageTitle = 'Anomaly Review & Discrepancy Investigation';
    breadcrumb = 'Anomaly Review';
  } else if (path.startsWith('/reports')) {
    pageTitle = 'Institutional Review Reports & Metrics';
    breadcrumb = 'Reports';
  } else if (path.startsWith('/audit')) {
    pageTitle = 'Regulatory Audit Trail & Event Logs';
    breadcrumb = 'Audit Trail';
  } else if (path.startsWith('/settings')) {
    pageTitle = 'System & Verification Configuration';
    breadcrumb = 'Settings';
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const matches = applications
      .filter(
        (app) =>
          app.institutionName.toLowerCase().includes(query.toLowerCase()) ||
          app.id.toLowerCase().includes(query.toLowerCase()) ||
          app.state.toLowerCase().includes(query.toLowerCase())
      )
      .map((app) => ({ id: app.id, name: app.institutionName }));
    setSearchResults(matches);
  };

  const handleSelectSearchResult = (appId: string) => {
    setSelectedApplicationId(appId);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    navigate(`/applications`);
  };

  const recentNotifications = auditEvents.slice(0, 5);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile hamburger + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-blue-600 transition-colors">
                NIRIKSHAK
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-800 font-semibold">{breadcrumb}</span>
            </nav>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Center: Global Search with Instant Dropdown */}
        <div className="hidden md:flex relative w-64 lg:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search institutions, App ID (e.g. 0841)..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearching && (
            <div className="absolute top-10 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Matching Applications ({searchResults.length})
              </div>
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectSearchResult(result.id)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 text-slate-800 flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-600">{result.id}</span>
                      <p className="text-slate-600 font-medium truncate max-w-[200px]">
                        {result.name}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-xs text-slate-500 text-center">
                  No matching institutions found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={onOpenNewApplication}
            className="hidden sm:inline-flex"
          >
            New Application
          </Button>

          {/* SIH Hackathon Demo Walkthrough Guide Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer relative"
            title="Demonstration Guide for Evaluators"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
              aria-label="Open simulated notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white pulse-live" />
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <span className="text-xs font-bold text-slate-900">
                      Recent Regulatory Events
                    </span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                      LIVE FEED
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {recentNotifications.map((evt) => (
                      <div key={evt.id} className="p-3 text-xs hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                          <span className="font-semibold text-blue-600 font-mono">
                            {evt.applicationId}
                          </span>
                          <span>{evt.timestamp}</span>
                        </div>
                        <p className="font-semibold text-slate-800 text-[11px]">{evt.action}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {evt.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                    <Link
                      to="/audit"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      View Full Audit Trail <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Reviewer Mini Pill */}
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
              RS
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{profile.name}</p>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Regulatory Reviewer</p>
            </div>
          </div>
        </div>
      </header>

      {/* Demonstration Walkthrough Guide Modal */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="NIRIKSHAK AI — Demonstration Guide"
        subtitle="Recommended Live Demonstration Walkthrough for Regulatory Reviewers"
        maxWidth="2xl"
        footer={
          <Button variant="primary" onClick={() => setShowHelpModal(false)}>
            Close & Start Inspecting
          </Button>
        }
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-blue-900 leading-relaxed">
              <strong>NIRIKSHAK AI</strong> demonstrates an AI-assisted regulatory review and document
              authentication system. It addresses institutional application fraud, statutory compliance
              delays, and cross-document discrepancies for regulatory bodies like AICTE.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Recommended 5-Minute Demonstration Flow:
            </h4>
            <ol className="list-decimal pl-5 space-y-2 leading-relaxed">
              <li>
                <strong>Overview Dashboard:</strong> View institutional submission KPIs (248 Total, 36
                Pending), 7-month submission trends, verification donut chart, and live activity feed.
              </li>
              <li>
                <strong>Open Application Dossier:</strong> Navigate to <em>Applications</em> and select
                <strong> APP-2026-0841 (Apex Institute of Technology & Management)</strong>.
              </li>
              <li>
                <strong>Document Verification Workspace:</strong> Inspect the 5 statutory documents.
                Click <strong>&ldquo;Run Demo Verification&rdquo;</strong> to watch the OCR text extraction,
                layout scanning, and cross-consistency check in action.
              </li>
              <li>
                <strong>Inspect Detected Discrepancy:</strong> Observe the highlighted date mismatch in
                the Land Lease Deed (Lease valid till 2028 vs institutional declaration 2032).
              </li>
              <li>
                <strong>Regulatory Compliance Checks:</strong> Examine the 6 statutory rules. View
                evidence snippets and evaluate cadre ratios.
              </li>
              <li>
                <strong>Anomaly Review & Resolution:</strong> Review the high-priority finding
                FND-2026-104. Mark it for Human Review or dispatch a Deficiency Notice.
              </li>
              <li>
                <strong>Export & Audit Trail:</strong> Visit <em>Reports</em> or <em>Audit Trail</em> and
                click <strong>&ldquo;Export CSV&rdquo;</strong> to download full demonstration audit logs.
              </li>
            </ol>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-[11px] text-slate-600">
              <strong>Disclaimer:</strong> This application operates strictly on client-side state with
              realistic simulated data. It does not connect to external servers or make official claims
              of live AICTE database verification.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
