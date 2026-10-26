import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { Overview } from './pages/Overview';
import { Applications } from './pages/Applications';
import { DocumentVerification } from './pages/DocumentVerification';
import { ComplianceChecks } from './pages/ComplianceChecks';
import { AnomalyReview } from './pages/AnomalyReview';
import { Reports } from './pages/Reports';
import { AuditTrail } from './pages/AuditTrail';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="applications" element={<Applications />} />
            <Route path="documents" element={<DocumentVerification />} />
            <Route path="compliance" element={<ComplianceChecks />} />
            <Route path="anomalies" element={<AnomalyReview />} />
            <Route path="reports" element={<Reports />} />
            <Route path="audit" element={<AuditTrail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
