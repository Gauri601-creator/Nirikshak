import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  FileCheck2,
  ShieldCheck,
  AlertOctagon,
  BarChart3,
  History,
  Settings,
  ShieldAlert,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { applications, findings, profile } = useApp();

  const pendingAppsCount = applications.filter(
    (a) => a.verificationStatus === 'Pending Review' || a.verificationStatus === 'Needs Correction'
  ).length;
  const activeFindingsCount = findings.filter((f) => f.status !== 'Resolved').length;

  const navItems = [
    {
      name: 'Overview',
      path: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Applications',
      path: '/applications',
      icon: FolderKanban,
      badge: pendingAppsCount > 0 ? pendingAppsCount : null,
      badgeColor: 'bg-blue-600',
    },
    {
      name: 'Document Verification',
      path: '/documents',
      icon: FileCheck2,
      badge: null,
    },
    {
      name: 'Compliance Checks',
      path: '/compliance',
      icon: ShieldCheck,
      badge: null,
    },
    {
      name: 'Anomaly Review',
      path: '/anomalies',
      icon: AlertOctagon,
      badge: activeFindingsCount > 0 ? activeFindingsCount : null,
      badgeColor: 'bg-red-500',
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: BarChart3,
      badge: null,
    },
    {
      name: 'Audit Trail',
      path: '/audit',
      icon: History,
      badge: null,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#101828] text-white flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-mono">
                  NIRIKSHAK
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Regulatory Oversight System
              </p>
            </div>
          </div>
        </div>

        {/* Hackathon Badge Pill */}
        <div className="mx-4 mt-3 mb-1 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold text-slate-200">Regulatory Scrutiny System</span>
          </div>
          <span className="text-[9px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-1 rounded">
            DEMO
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full text-white ${
                      item.badgeColor || 'bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Tagline Footer Banner */}
        <div className="px-4 py-2.5 mx-3 mb-2 rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-900 border border-slate-700/50">
          <p className="text-[10px] text-slate-300 font-medium italic text-center">
            &ldquo;Inspect Smarter. Verify Better. Build Trust.&rdquo;
          </p>
        </div>

        {/* Reviewer Profile Section */}
        <div className="p-3 border-t border-slate-800 bg-[#0c1322]">
          <NavLink
            to="/settings"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/60 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-slate-700">
                RS
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                  {profile.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Regulatory Review Team
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0" />
          </NavLink>
        </div>
      </aside>
    </>
  );
};
