import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/dashboard/StatCard';
import { TrendChart } from '../components/dashboard/TrendChart';
import { VerificationDonut } from '../components/dashboard/VerificationDonut';
import { RecentApplicationsTable } from '../components/dashboard/RecentApplicationsTable';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { Button } from '../components/common/Button';
import { NewApplicationModal } from '../components/common/NewApplicationModal';
import {
  FileText,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Sparkles,
  Info,
} from 'lucide-react';

export const Overview: React.FC = () => {
  const { profile, applications, findings } = useApp();
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);

  const totalAppsCount = Math.max(248, applications.length);
  const pendingCount =
    applications.filter(
      (a) => a.verificationStatus === 'Pending Review' || a.verificationStatus === 'Needs Correction'
    ).length + 30;
  const flaggedCount = findings.filter((f) => f.status !== 'Resolved').length + 15;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#1D4ED8] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-400/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Institutional Verification System
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.name}
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl mt-1 leading-relaxed">
              Monitor application verification, document quality, and compliance review in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsNewAppModalOpen(true)}
              className="bg-white text-blue-900 hover:bg-blue-50 shadow-md font-bold"
            >
              + New Application
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-blue-400/20 flex flex-wrap items-center justify-between text-xs text-blue-200/80 gap-2">
          <span>Active Role: Senior Regulatory Reviewer • Bureau of Institutional Affiliation</span>
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Illustrative demonstration statistics for hackathon evaluation
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={totalAppsCount}
          label="Institutional applications received"
          trend={{ value: '+12% this cycle', isPositive: true }}
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-50"
          accentBorderColor="border-blue-200/80"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingCount}
          label="Awaiting document verification"
          trend={{ value: '-4% backlog speed', isPositive: true }}
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          iconBgColor="bg-amber-50"
          accentBorderColor="border-amber-200/80"
        />
        <StatCard
          title="Documents Flagged"
          value={flaggedCount}
          label="Requires reviewer scrutiny"
          trend={{ value: '+3 today', isPositive: false }}
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          iconBgColor="bg-red-50"
          accentBorderColor="border-red-200/80"
        />
        <StatCard
          title="Compliance Checks"
          value="82%"
          label="Mandatory statutory checks met"
          trend={{ value: '+5% vs benchmark', isPositive: true }}
          icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
          accentBorderColor="border-emerald-200/80"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <div className="lg:col-span-1">
          <VerificationDonut />
        </div>
      </div>

      {/* Applications Table & Activity Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentApplicationsTable limit={5} showFilters={true} />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* New Application Modal */}
      <NewApplicationModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
      />
    </div>
  );
};
