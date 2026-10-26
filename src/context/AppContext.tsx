import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ApplicationRecord,
  AnomalyFinding,
  ComplianceRule,
  AuditEvent,
  ReviewerProfile,
  ToastMessage,
  ApplicationStatus,
  DocumentRecord,
} from '../types';
import {
  INITIAL_APPLICATIONS,
  INITIAL_FINDINGS,
  INITIAL_COMPLIANCE_RULES,
  INITIAL_AUDIT_EVENTS,
  INITIAL_PROFILE,
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  applications: ApplicationRecord[];
  findings: AnomalyFinding[];
  complianceRules: ComplianceRule[];
  auditEvents: AuditEvent[];
  profile: ReviewerProfile;
  selectedApplicationId: string;
  toasts: ToastMessage[];
  setSelectedApplicationId: (id: string) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) => void;
  updateApplicationNotes: (id: string, notes: string) => void;
  addApplication: (appData: Partial<ApplicationRecord>) => void;
  requestCorrection: (id: string, reason: string) => void;
  markForHumanReview: (id: string, reason: string) => void;
  approveApplication: (id: string) => void;
  runDemoVerificationForApp: (id: string) => Promise<void>;
  addDocumentToApp: (appId: string, doc: Omit<DocumentRecord, 'id'>) => void;
  removeDocumentFromApp: (appId: string, docId: string) => void;
  markFindingReviewed: (findingId: string, notes?: string) => void;
  resolveFinding: (findingId: string, resolutionNote: string) => void;
  updateComplianceRule: (ruleId: string, status: ComplianceRule['status'], findingDetails?: string) => void;
  runAllComplianceChecks: () => Promise<void>;
  addCustomRule: (rule: Omit<ComplianceRule, 'id'>) => void;
  updateProfile: (newProfile: Partial<ReviewerProfile>) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetAllDemoData: () => void;
  exportToCsv: (filename: string, headers: string[], rows: (string | number)[][]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  APPLICATIONS: 'nirikshak_applications_v1',
  FINDINGS: 'nirikshak_findings_v1',
  RULES: 'nirikshak_rules_v1',
  AUDIT: 'nirikshak_audit_v1',
  PROFILE: 'nirikshak_profile_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [findings, setFindings] = useState<AnomalyFinding[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FINDINGS);
      return stored ? JSON.parse(stored) : INITIAL_FINDINGS;
    } catch {
      return INITIAL_FINDINGS;
    }
  });

  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RULES);
      return stored ? JSON.parse(stored) : INITIAL_COMPLIANCE_RULES;
    } catch {
      return INITIAL_COMPLIANCE_RULES;
    }
  });

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return stored ? JSON.parse(stored) : INITIAL_AUDIT_EVENTS;
    } catch {
      return INITIAL_AUDIT_EVENTS;
    }
  });

  const [profile, setProfile] = useState<ReviewerProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('APP-2026-0841');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FINDINGS, JSON.stringify(findings));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [findings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(complianceRules));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [complianceRules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditEvents));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [auditEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [profile]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const recordAudit = (
    action: AuditEvent['action'],
    applicationId: string,
    description: string,
    status: AuditEvent['status'] = 'Success'
  ) => {
    const newEvent: AuditEvent = {
      id: `EVT-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      user: profile.name,
      applicationId,
      action,
      description,
      status,
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, notes?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const historyEntry = {
            id: `HIST-${Date.now()}`,
            date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            author: profile.name,
            action: `Status updated to ${status}`,
            note: notes || `Application transitioned to ${status}`,
          };
          return {
            ...app,
            verificationStatus: status,
            lastUpdated: new Date().toISOString().split('T')[0],
            reviewerNotes: notes ? `${app.reviewerNotes ? app.reviewerNotes + ' | ' : ''}${notes}` : app.reviewerNotes,
            reviewHistory: [historyEntry, ...app.reviewHistory],
          };
        }
        return app;
      })
    );
    recordAudit('Review Status Updated', id, `Status updated to "${status}"${notes ? ': ' + notes : ''}`, 'Info');
    addToast({
      title: 'Status Updated',
      description: `Application ${id} status set to "${status}"`,
      type: 'info',
    });
  };

  const updateApplicationNotes = (id: string, notes: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, reviewerNotes: notes, lastUpdated: new Date().toISOString().split('T')[0] } : app))
    );
    addToast({
      title: 'Notes Saved',
      description: `Reviewer notes updated for ${id}`,
      type: 'success',
    });
  };

  const addApplication = (appData: Partial<ApplicationRecord>) => {
    const newId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: ApplicationRecord = {
      id: newId,
      institutionName: appData.institutionName || 'New Institutional Applicant',
      institutionCode: `AICTE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      state: appData.state || 'Delhi',
      district: appData.district || 'New Delhi',
      type: appData.type || 'Engineering & Technology',
      submissionDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      verificationStatus: 'Pending Review',
      complianceStatus: 'Under Review',
      complianceScore: 50,
      documentsCount: 1,
      findingsCount: 0,
      assignedOfficer: profile.name,
      reviewerNotes: 'Application newly registered via reviewer intake portal.',
      reviewHistory: [
        {
          id: `HIST-${Date.now()}`,
          date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          author: profile.name,
          action: 'Application Intake Created',
          note: 'Dossier registered in NIRIKSHAK AI system.',
        },
      ],
      documents: [
        {
          id: `DOC-${Date.now()}`,
          name: 'Institutional_Registration_Draft.pdf',
          category: 'Institutional Registration Certificate',
          fileSize: '1.8 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          fileType: 'pdf',
          reviewStatus: 'Pending',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
    recordAudit('Application Created', newId, `Registered institution "${newApp.institutionName}"`, 'Success');
    addToast({
      title: 'Application Created',
      description: `Application ${newId} registered successfully.`,
      type: 'success',
    });
    setSelectedApplicationId(newId);
  };

  const requestCorrection = (id: string, reason: string) => {
    updateApplicationStatus(id, 'Needs Correction', `Deficiency Notice: ${reason}`);
    recordAudit('Correction Requested', id, `Correction requested: ${reason}`, 'Warning');
    addToast({
      title: 'Correction Requested',
      description: `Simulated deficiency notice dispatched to applicant for ${id}.`,
      type: 'warning',
    });
  };

  const markForHumanReview = (id: string, reason: string) => {
    updateApplicationStatus(id, 'Flagged for Human Review', `Human Escalation: ${reason}`);
    recordAudit('Review Status Updated', id, `Marked for secondary regulatory review: ${reason}`, 'Action Required');
    addToast({
      title: 'Flagged for Human Review',
      description: `Application ${id} flagged for senior regulatory review.`,
      type: 'info',
    });
  };

  const approveApplication = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const historyEntry = {
            id: `HIST-${Date.now()}`,
            date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            author: profile.name,
            action: 'Application Approved',
            note: 'All statutory documents authenticated and compliance certified.',
          };
          return {
            ...app,
            verificationStatus: 'Verified',
            complianceStatus: 'Compliant',
            complianceScore: 98,
            findingsCount: 0,
            lastUpdated: new Date().toISOString().split('T')[0],
            reviewHistory: [historyEntry, ...app.reviewHistory],
          };
        }
        return app;
      })
    );

    // Resolve any open findings on this application
    setFindings((prev) =>
      prev.map((f) => (f.applicationId === id ? { ...f, status: 'Resolved', resolvedAt: new Date().toISOString().split('T')[0] } : f))
    );

    recordAudit('Application Approved', id, 'Full statutory compliance validated and application verified.', 'Success');
    
    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#16A34A', '#F59E0B', '#3B82F6'],
      });
    } catch {
      // fallback
    }

    addToast({
      title: 'Application Approved',
      description: `Application ${id} has been verified and approved.`,
      type: 'success',
    });
  };

  const runDemoVerificationForApp = async (id: string): Promise<void> => {
    recordAudit('Demo Verification Initiated', id, 'Initiated OCR text extraction, layout inspection, and cross-consistency checks.', 'Info');
    
    // Simulate pipeline delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const updatedDocs = app.documents.map((d, index) => {
            if (index === 0) return { ...d, reviewStatus: 'Verified' as const };
            if (index === 1 && d.anomalyFlag) return { ...d, reviewStatus: 'Flagged' as const };
            return { ...d, reviewStatus: 'Verified' as const };
          });
          return {
            ...app,
            documents: updatedDocs,
            complianceScore: Math.min(92, Math.max(app.complianceScore, 75)),
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return app;
      })
    );

    addToast({
      title: 'Demo Verification Completed',
      description: `Analysis completed for ${id}. Preliminary findings generated.`,
      type: 'success',
    });
  };

  const addDocumentToApp = (appId: string, doc: Omit<DocumentRecord, 'id'>) => {
    const newDocId = `DOC-${Date.now().toString().slice(-6)}`;
    const fullDoc: DocumentRecord = {
      ...doc,
      id: newDocId,
    };

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            documentsCount: app.documentsCount + 1,
            documents: [fullDoc, ...app.documents],
          };
        }
        return app;
      })
    );

    recordAudit('Document Uploaded', appId, `Uploaded ${doc.name} (${doc.category})`, 'Success');
    addToast({
      title: 'Document Added',
      description: `${doc.name} attached to application ${appId}.`,
      type: 'success',
    });
  };

  const removeDocumentFromApp = (appId: string, docId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const filtered = app.documents.filter((d) => d.id !== docId);
          return {
            ...app,
            documentsCount: filtered.length,
            documents: filtered,
          };
        }
        return app;
      })
    );
    addToast({
      title: 'Document Removed',
      description: 'Document deleted from application dossier.',
      type: 'info',
    });
  };

  const markFindingReviewed = (findingId: string, notes?: string) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, status: 'In Review', reviewerNotes: notes || f.reviewerNotes } : f))
    );
    const target = findings.find((f) => f.id === findingId);
    if (target) {
      recordAudit('Finding Reviewed', target.applicationId, `Inspected finding ${findingId} (${target.findingType})`, 'Info');
    }
    addToast({
      title: 'Finding In Review',
      description: `Finding ${findingId} marked as undergoing reviewer evaluation.`,
      type: 'info',
    });
  };

  const resolveFinding = (findingId: string, resolutionNote: string) => {
    setFindings((prev) =>
      prev.map((f) =>
        f.id === findingId
          ? {
              ...f,
              status: 'Resolved',
              resolvedAt: new Date().toISOString().split('T')[0],
              reviewerNotes: resolutionNote,
            }
          : f
      )
    );

    const target = findings.find((f) => f.id === findingId);
    if (target) {
      // update application finding count
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === target.applicationId) {
            return {
              ...app,
              findingsCount: Math.max(0, app.findingsCount - 1),
              complianceScore: Math.min(100, app.complianceScore + 8),
            };
          }
          return app;
        })
      );
      recordAudit('Finding Reviewed', target.applicationId, `Resolved finding ${findingId}: ${resolutionNote}`, 'Success');
    }

    addToast({
      title: 'Finding Resolved',
      description: `Finding ${findingId} marked as resolved.`,
      type: 'success',
    });
  };

  const updateComplianceRule = (ruleId: string, status: ComplianceRule['status'], findingDetails?: string) => {
    setComplianceRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              status,
              findingDetails: findingDetails || r.findingDetails,
            }
          : r
      )
    );
    recordAudit('Compliance Check Run', selectedApplicationId, `Manual compliance override on rule ${ruleId} -> ${status}`, 'Info');
    addToast({
      title: 'Rule Status Updated',
      description: `Rule ${ruleId} updated to ${status}.`,
      type: 'info',
    });
  };

  const runAllComplianceChecks = async () => {
    recordAudit('Compliance Check Run', selectedApplicationId, 'Evaluated all configured statutory demo compliance rules.', 'Info');
    await new Promise((res) => setTimeout(res, 900));

    setComplianceRules((prev) =>
      prev.map((rule, idx) => {
        if (idx === 1) return { ...rule, status: 'Needs Review' };
        if (idx === 2) return { ...rule, status: 'Needs Review' };
        return { ...rule, status: 'Passed' };
      })
    );

    addToast({
      title: 'Compliance Evaluation Done',
      description: 'All 6 demonstration compliance rules evaluated.',
      type: 'success',
    });
  };

  const addCustomRule = (rule: Omit<ComplianceRule, 'id'>) => {
    const newRule: ComplianceRule = {
      ...rule,
      id: `RULE-${Math.floor(200 + Math.random() * 800)}`,
      isCustom: true,
    };
    setComplianceRules((prev) => [...prev, newRule]);
    addToast({
      title: 'Custom Rule Added',
      description: `Rule "${rule.name}" configured into demo ruleset.`,
      type: 'success',
    });
  };

  const updateProfile = (newProfile: Partial<ReviewerProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
    addToast({
      title: 'Settings Saved',
      description: 'Reviewer preferences updated successfully.',
      type: 'success',
    });
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.FINDINGS);
    localStorage.removeItem(STORAGE_KEYS.RULES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);

    setApplications(INITIAL_APPLICATIONS);
    setFindings(INITIAL_FINDINGS);
    setComplianceRules(INITIAL_COMPLIANCE_RULES);
    setAuditEvents(INITIAL_AUDIT_EVENTS);
    setProfile(INITIAL_PROFILE);
    setSelectedApplicationId('APP-2026-0841');

    addToast({
      title: 'Demo State Reset',
      description: 'All sample records restored to initial demonstration defaults.',
      type: 'info',
    });
  };

  const exportToCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((item) => {
            const str = String(item ?? '');
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    recordAudit('Data Exported', 'SYSTEM', `Exported CSV report: ${filename}.csv`, 'Success');
    addToast({
      title: 'Report Exported',
      description: `Downloaded ${filename}.csv successfully.`,
      type: 'success',
    });
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        findings,
        complianceRules,
        auditEvents,
        profile,
        selectedApplicationId,
        toasts,
        setSelectedApplicationId,
        updateApplicationStatus,
        updateApplicationNotes,
        addApplication,
        requestCorrection,
        markForHumanReview,
        approveApplication,
        runDemoVerificationForApp,
        addDocumentToApp,
        removeDocumentFromApp,
        markFindingReviewed,
        resolveFinding,
        updateComplianceRule,
        runAllComplianceChecks,
        addCustomRule,
        updateProfile,
        addToast,
        removeToast,
        resetAllDemoData,
        exportToCsv,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
