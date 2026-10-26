import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Eye, FileText, ArrowRight, ExternalLink } from 'lucide-react';

interface RecentApplicationsTableProps {
  limit?: number;
  showFilters?: boolean;
}

export const RecentApplicationsTable: React.FC<RecentApplicationsTableProps> = ({
  limit = 5,
  showFilters = true,
}) => {
  const navigate = useNavigate();
  const { applications, setSelectedApplicationId } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.state.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || app.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const displayedApps = limit ? filteredApps.slice(0, limit) : filteredApps;

  const handleViewDetails = (appId: string) => {
    setSelectedApplicationId(appId);
    navigate('/applications');
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

  return (
    <div className="bg-white rounded-xl border border-slate-200 card-shadow overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Applications Dossier</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional submissions undergoing AI verification & regulatory review
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Filter table records..."
              className="w-48 sm:w-60"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Needs Correction">Needs Correction</option>
              <option value="Flagged for Human Review">Flagged for Review</option>
              <option value="Verified">Verified Compliant</option>
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header border-b border-slate-200">
              <th className="py-3 px-4 font-semibold">Application ID</th>
              <th className="py-3 px-4 font-semibold">Institution Name</th>
              <th className="py-3 px-4 font-semibold">Submission Date</th>
              <th className="py-3 px-4 font-semibold">Documents</th>
              <th className="py-3 px-4 font-semibold">Verification Status</th>
              <th className="py-3 px-4 font-semibold">Compliance</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {displayedApps.length > 0 ? (
              displayedApps.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => handleViewDetails(app.id)}
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {app.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {app.institutionName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {app.district}, {app.state} • <span className="font-medium text-slate-500">{app.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {app.submissionDate}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      {app.documentsCount} files
                      {app.findingsCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" title={`${app.findingsCount} flagged issues`} />
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(app.verificationStatus)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
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
                      <span className="font-mono font-bold text-slate-700 text-[11px]">
                        {app.complianceScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(app.id)}
                      rightIcon={<ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />}
                      className="py-1 px-2.5 text-xs font-semibold"
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No institutional applications found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {displayedApps.length} of {applications.length} applications</span>
        <button
          onClick={() => navigate('/applications')}
          className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
        >
          View Full Applications List <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
