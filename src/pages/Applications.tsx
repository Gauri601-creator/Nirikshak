import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ApplicationStatus, ApplicationRecord } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { SearchInput } from '../components/common/SearchInput';
import { NewApplicationModal } from '../components/common/NewApplicationModal';
import { ApplicationDetails } from './ApplicationDetails';
import {
  FileText,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Download,
} from 'lucide-react';

export const Applications: React.FC = () => {
  const navigate = useNavigate();
  const {
    applications,
    selectedApplicationId,
    setSelectedApplicationId,
    exportToCsv,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'detail'>('list');

  const itemsPerPage = 8;

  const selectedApp = applications.find((a: ApplicationRecord) => a.id === selectedApplicationId) || applications[0];

  const filtered = applications.filter((app: ApplicationRecord) => {
    const matchesSearch =
      app.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.institutionCode.toLowerCase().includes(search.toLowerCase()) ||
      app.state.toLowerCase().includes(search.toLowerCase()) ||
      app.district.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.verificationStatus === statusFilter;
    const matchesType = typeFilter === 'ALL' || app.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const sorted = [...filtered].sort((a: ApplicationRecord, b: ApplicationRecord) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc'
        ? new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
        : new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
    }
    if (sortBy === 'score') {
      return sortOrder === 'desc' ? b.complianceScore - a.complianceScore : a.complianceScore - b.complianceScore;
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc'
        ? b.institutionName.localeCompare(a.institutionName)
        : a.institutionName.localeCompare(b.institutionName);
    }
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenDetail = (appId: string) => {
    setSelectedApplicationId(appId);
    setActiveTab('detail');
  };

  const handleExportApplications = () => {
    const headers = [
      'Application ID',
      'Institution Name',
      'AICTE Code',
      'Type',
      'State',
      'District',
      'Submission Date',
      'Status',
      'Compliance Score',
      'Documents Count',
      'Flagged Issues',
    ];
    const rows = applications.map((a: ApplicationRecord) => [
      a.id,
      a.institutionName,
      a.institutionCode,
      a.type,
      a.state,
      a.district,
      a.submissionDate,
      a.verificationStatus,
      `${a.complianceScore}%`,
      a.documentsCount,
      a.findingsCount,
    ]);
    exportToCsv('nirikshak_applications_master', headers, rows);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="success" dot>Verified</Badge>;
      case 'Pending Review':
        return <Badge variant="info" dot>Pending Review</Badge>;
      case 'Needs Correction':
        return <Badge variant="warning" dot>Needs Correction</Badge>;
      case 'Flagged for Human Review':
        return <Badge variant="danger" dot>Human Review</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  if (activeTab === 'detail' && selectedApp) {
    return (
      <ApplicationDetails
        application={selectedApp}
        onBack={() => setActiveTab('list')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Institutional Applications Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review submitted institution dossiers, verify regulatory compliance, and execute AI document inspection.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4 text-slate-500" />}
            onClick={handleExportApplications}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewModalOpen(true)}
          >
            New Application
          </Button>
        </div>
      </div>

      {/* Quick Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'All Applications', value: 'ALL', count: applications.length },
          {
            label: 'Pending Review',
            value: 'Pending Review',
            count: applications.filter((a: ApplicationRecord) => a.verificationStatus === 'Pending Review').length,
            icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
          },
          {
            label: 'Needs Correction',
            value: 'Needs Correction',
            count: applications.filter((a: ApplicationRecord) => a.verificationStatus === 'Needs Correction').length,
            icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          },
          {
            label: 'Flagged for Review',
            value: 'Flagged for Human Review',
            count: applications.filter((a: ApplicationRecord) => a.verificationStatus === 'Flagged for Human Review').length,
            icon: <ShieldAlert className="w-3.5 h-3.5 text-red-600" />,
          },
          {
            label: 'Verified Compliant',
            value: 'Verified',
            count: applications.filter((a: ApplicationRecord) => a.verificationStatus === 'Verified').length,
            icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              statusFilter === tab.value
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                statusFilter === tab.value ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden">
        {/* Table Filter Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search by Institution, ID, AISHE Code, or State..."
            className="w-full md:w-80"
          />

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Discipline Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Disciplines</option>
                <option value="Engineering & Technology">Engineering & Technology</option>
                <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                <option value="Management Studies">Management Studies</option>
                <option value="Pharmacy & Health">Pharmacy & Health</option>
                <option value="Architecture & Town Planning">Architecture & Planning</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as 'date' | 'score' | 'name');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="date-desc">Newest Submission</option>
                <option value="date-asc">Oldest Submission</option>
                <option value="score-desc">Highest Compliance</option>
                <option value="score-asc">Lowest Compliance</option>
                <option value="name-asc">Institution Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header border-b border-slate-200">
                <th className="py-3.5 px-4 font-semibold">Application ID</th>
                <th className="py-3.5 px-4 font-semibold">Institution Name & Code</th>
                <th className="py-3.5 px-4 font-semibold">Discipline</th>
                <th className="py-3.5 px-4 font-semibold">Submission Date</th>
                <th className="py-3.5 px-4 font-semibold">Documents</th>
                <th className="py-3.5 px-4 font-semibold">Verification Status</th>
                <th className="py-3.5 px-4 font-semibold">Compliance</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginated.length > 0 ? (
                paginated.map((app: ApplicationRecord) => (
                  <tr
                    key={app.id}
                    onClick={() => handleOpenDetail(app.id)}
                    className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-600 block">{app.id}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{app.state}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {app.institutionName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {app.institutionCode} • {app.district}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {app.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {app.submissionDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{app.documentsCount} files</span>
                        {app.findingsCount > 0 && (
                          <span
                            className="inline-flex items-center justify-center text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded-full ml-1"
                            title={`${app.findingsCount} flagged issues`}
                          >
                            {app.findingsCount} issues
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(app.verificationStatus)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              app.complianceScore >= 80
                                ? 'bg-emerald-500'
                                : app.complianceScore >= 60
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${app.complianceScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-800 text-[11px]">
                          {app.complianceScore}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenDetail(app.id)}
                        className="py-1 px-3 text-xs"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-semibold text-slate-700">No applications found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search criteria or clear active filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-900">{paginated.length}</span> of{' '}
            <span className="font-bold text-slate-900">{sorted.length}</span> filtered applications
          </div>

          <div className="flex items-center gap-2 self-center sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              className="py-1 px-2.5 text-xs"
            >
              Previous
            </Button>
            <span className="px-2 font-mono font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              className="py-1 px-2.5 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <NewApplicationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />
    </div>
  );
};
