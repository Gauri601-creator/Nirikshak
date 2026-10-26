import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  MONTHLY_TREND_DATA,
  CATEGORY_DISTRIBUTION_DATA,
  ANOMALY_BREAKDOWN_DATA,
} from '../data/mockData';
import { Button } from '../components/common/Button';
import {
  Download,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Info,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { exportToCsv } = useApp();

  const [dateRange, setDateRange] = useState('7m');

  const handleExportReportCsv = () => {
    const headers = [
      'Metric Category',
      'Value / Count',
      'Percentage / Rate',
      'Benchmark Comparison',
      'Reporting Cycle',
    ];
    const rows = [
      ['Total Institutional Applications', '248', '100%', '+12% vs previous cycle', '2025-26 Cycle'],
      ['Verified Statutory Compliant', '152', '61.3%', '+8.4% automation lift', '2025-26 Cycle'],
      ['Pending Regulatory Review', '48', '19.4%', '-4.2% backlog reduction', 'Active Queue'],
      ['Issued Deficiency Notices', '30', '12.1%', 'Average response 4.2 days', '2025-26 Cycle'],
      ['Flagged for Human In-Depth Scrutiny', '18', '7.2%', 'High Priority 6 records', 'Active Queue'],
      ['Date Inconsistencies Detected', '18', '32% of findings', 'Lease deeds & NOCs', 'Demonstration Metric'],
      ['Missing Mandatory Fields', '14', '25% of findings', 'Vouchers & AISHE codes', 'Demonstration Metric'],
      ['Cadre / Teacher-Student Ratio Alert', '7', '13% of findings', '1:15 engineering norm', 'Demonstration Metric'],
    ];

    exportToCsv('nirikshak_regulatory_performance_report', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Institutional Verification Reports & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aggregate institutional verification trends, compliance distributions, and anomaly diagnostics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none"
            >
              <option value="7m">Last 7 Months (Oct 25 – Apr 26)</option>
              <option value="3m">Last Quarter (Feb – Apr 2026)</option>
              <option value="1y">Full Academic Year 2025-26</option>
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportReportCsv}
            className="font-bold"
          >
            Export Comprehensive CSV
          </Button>
        </div>
      </div>

      {/* Demonstration Disclaimer Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Demonstration Data:</strong> All aggregate statistics, compliance ratios, and turnaround times
            shown in this dashboard are illustrative demonstration values for regulatory evaluation.
          </span>
        </div>
        <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold shrink-0">
          Institutional Analytics
        </span>
      </div>

      {/* Top 4 High-Level Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 card-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Applications Reviewed
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">248</div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% increase vs 2024-25 cycle
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 card-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Avg. Verification Turnaround
          </span>
          <div className="text-3xl font-extrabold font-mono text-blue-600 mt-1">2.4 Days</div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Reduced from 18 days manual baseline
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 card-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Compliance Success Rate
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-600 mt-1">82.4%</div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            152 approved without major deficiency
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 card-shadow">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Anomaly Detection Ratio
          </span>
          <div className="text-3xl font-extrabold font-mono text-amber-600 mt-1">7.6%</div>
          <div className="mt-2 text-xs text-amber-600 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> 19 dossiers flagged for scrutiny
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Monthly Activity & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Activity Stacked Bar */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 card-shadow">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Regulatory Review Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submissions, automated validations, and flagged interventions
              </p>
            </div>
            <span className="text-[11px] font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              Oct 2025 – Apr 2026
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="verified" name="Verified Compliant" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="corrections" name="Deficiency Notices" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flagged" name="Flagged Discrepancies" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Programme Category Distribution Donut */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 card-shadow flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Discipline Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Application share by technical stream</p>
          </div>

          <div className="h-48 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION_DATA}
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {CATEGORY_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {CATEGORY_DISTRIBUTION_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Common Anomaly Categories Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Common Finding & Discrepancy Diagnostics</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of automated flags triggered during optical character recognition and document cross-validation
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Flagged Signals: <strong className="text-slate-900">56</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          {ANOMALY_BREAKDOWN_DATA.map((item) => (
            <div key={item.type} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {item.type}
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-extrabold font-mono text-slate-900">{item.count}</span>
                <span className="font-bold text-blue-600 bg-blue-100 px-1.5 py-0.2 rounded font-mono text-[10px]">
                  {item.share}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: item.share }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
