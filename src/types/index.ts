export type ApplicationStatus = 'Verified' | 'Pending Review' | 'Needs Correction' | 'Flagged for Human Review';

export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Under Review' | 'Pending Documents';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type FindingStatus = 'Open' | 'In Review' | 'Resolved';

export type FindingType = 
  | 'Date Inconsistency' 
  | 'Missing Required Information' 
  | 'Duplicate-looking Document' 
  | 'Unusual Image Characteristics' 
  | 'Cross-Document Mismatch'
  | 'Seal & Signature Ambiguity';

export type DocumentCategory = 
  | 'Institutional Registration Certificate'
  | 'Land & Infrastructure Report'
  | 'Faculty & Staff Cadre List'
  | 'Financial Audited Statement'
  | 'Fire Safety & Building Approval NOC'
  | 'State Directorate NOC'
  | 'Affiliation Recommendation Letter';

export interface DocumentRecord {
  id: string;
  name: string;
  category: DocumentCategory;
  fileSize: string;
  uploadDate: string;
  fileType: 'pdf' | 'png' | 'jpg' | 'jpeg';
  reviewStatus: 'Verified' | 'Flagged' | 'Pending' | 'Needs Re-upload';
  fileUrl?: string;
  extractedFields?: {
    institutionName?: string;
    registrationNumber?: string;
    issueDate?: string;
    validTill?: string;
    signatoryAuthority?: string;
    landAreaAcres?: string;
    facultyCount?: number;
    financialReserve?: string;
  };
  anomalyFlag?: boolean;
  anomalyNote?: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  category: 'Mandatory Documents' | 'Institutional Integrity' | 'Cadre & Infrastructure' | 'Statutory Approvals' | 'Financial Soundness';
  description: string;
  status: 'Passed' | 'Needs Review' | 'Failed Check' | 'Not Evaluated';
  relatedDocument: DocumentCategory | 'Multiple Documents' | 'Master Application';
  findingDetails: string;
  evidenceSnippet?: string;
  regulatoryReference: string;
  isCustom?: boolean;
}

export interface AnomalyFinding {
  id: string;
  applicationId: string;
  institutionName: string;
  documentName: string;
  findingType: FindingType;
  priority: PriorityLevel;
  dateDetected: string;
  status: FindingStatus;
  description: string;
  evidence: {
    field: string;
    valueInDoc: string;
    expectedValue: string;
    comparisonNote: string;
  };
  whyRaised: string;
  recommendedAction: string;
  reviewerNotes?: string;
  resolvedAt?: string;
}

export interface ApplicationRecord {
  id: string;
  institutionName: string;
  institutionCode: string;
  state: string;
  district: string;
  type: 'Engineering & Technology' | 'Management Studies' | 'Polytechnic Diploma' | 'Pharmacy & Health' | 'Architecture & Town Planning';
  submissionDate: string;
  lastUpdated: string;
  verificationStatus: ApplicationStatus;
  complianceStatus: ComplianceStatus;
  complianceScore: number; // 0 - 100
  documentsCount: number;
  documents: DocumentRecord[];
  findingsCount: number;
  assignedOfficer: string;
  reviewerNotes: string;
  reviewHistory: {
    id: string;
    date: string;
    author: string;
    action: string;
    note: string;
  }[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  applicationId: string;
  action: 
    | 'Application Created' 
    | 'Document Uploaded' 
    | 'Demo Verification Initiated' 
    | 'Finding Reviewed' 
    | 'Correction Requested' 
    | 'Review Status Updated'
    | 'Compliance Check Run'
    | 'Application Approved'
    | 'Data Exported';
  description: string;
  status: 'Success' | 'Warning' | 'Action Required' | 'Info';
}

export interface ReviewerProfile {
  name: string;
  role: string;
  email: string;
  department: string;
  badgeNumber: string;
  tableDensity: 'compact' | 'comfortable';
  autoRunVerification: boolean;
  soundAlerts: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
