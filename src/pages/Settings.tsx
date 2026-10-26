import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import {
  User,
  Sliders,
  Shield,
  RotateCcw,
  Save,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { profile, updateProfile, resetAllDemoData } = useApp();

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [email, setEmail] = useState(profile.email);
  const [department, setDepartment] = useState(profile.department);
  const [tableDensity, setTableDensity] = useState(profile.tableDensity);
  const [autoRunVerification, setAutoRunVerification] = useState(profile.autoRunVerification);
  const [soundAlerts, setSoundAlerts] = useState(profile.soundAlerts);

  const [minLandAcres, setMinLandAcres] = useState('5.0');
  const [minCadreRatio, setMinCadreRatio] = useState('1:15');
  const [leaseMinYears, setLeaseMinYears] = useState('30');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      role,
      email,
      department,
      tableDensity,
      autoRunVerification,
      soundAlerts,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Settings & Demonstration Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage reviewer profile attributes, UI display preferences, and simulated verification parameters.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
          onClick={resetAllDemoData}
          className="text-red-700 hover:bg-red-50 border-red-200"
        >
          Reset Demo Data
        </Button>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Reviewer Profile</h3>
            <p className="text-xs text-slate-500">
              Identity details for the active regulatory verification officer
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Designation / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reviewer Email (Demonstration Address)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Fictional sandbox domain (.demo) prevents external email routing.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Bureau / Division
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* UI Display Preferences */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Display & Interaction Preferences</h3>
            <p className="text-xs text-slate-500">
              Customize table layout density and automated assistance modes
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
            <div>
              <span className="font-bold text-slate-900 block">Table Density</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Toggle between standard spacious rows and high-density inspection rows
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setTableDensity('comfortable')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  tableDensity === 'comfortable' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                Comfortable
              </button>
              <button
                type="button"
                onClick={() => setTableDensity('compact')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  tableDensity === 'compact' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                Compact
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
            <div>
              <span className="font-bold text-slate-900 block">Auto-Run AI Screening on File Upload</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Automatically trigger OCR text extraction and ELA image check immediately when a document is uploaded
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoRunVerification}
                onChange={(e) => setAutoRunVerification(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Verification Parameters Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 card-shadow p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Demo Verification Thresholds & Rules
            </h3>
            <p className="text-xs text-slate-500">
              Configurable compliance limits for automated rule evaluation
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Minimum Land Parcel (Acres)
            </label>
            <input
              type="text"
              value={minLandAcres}
              onChange={(e) => setMinLandAcres(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Default: 5.0 Acres (Metro/Mega)</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Statutory Cadre Ratio
            </label>
            <input
              type="text"
              value={minCadreRatio}
              onChange={(e) => setMinCadreRatio(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Undergraduate Engineering: 1:15</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Minimum Unencumbered Lease (Yrs)
            </label>
            <input
              type="text"
              value={leaseMinYears}
              onChange={(e) => setLeaseMinYears(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Statutory standard: 30 Years</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
          <strong>Reviewer Note:</strong> Updating demonstration threshold values alters simulated compliance
          thresholds in the local browser state. This feature allows reviewers to test dynamic policy changes.
        </div>
      </div>

      {/* Project & Team Information Card */}
      <div className="bg-gradient-to-r from-slate-900 to-[#101828] text-white rounded-xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-black text-xl tracking-tight text-white">NIRIKSHAK AI</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30 font-mono">
                v1.0 Demo
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium italic">
              &ldquo;Inspect Smarter. Verify Better. Build Trust.&rdquo;
            </p>
            <div className="mt-3 text-xs text-slate-400 space-y-0.5">
              <p>
                <strong>System:</strong> Institutional Application & Verification Platform
              </p>
              <p>
                <strong>Deployment:</strong> Regulatory Demonstration Environment
              </p>
              <p>
                <strong>Domain:</strong> AI-Powered Institutional Application Validation, Document
                Authentication & Regulatory Compliance
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 inline-block font-semibold">
              Client-Side Standalone Build
            </span>
            <p className="text-[10px] text-slate-400 mt-2">
              Zero backend requirement • Local browser persistence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
