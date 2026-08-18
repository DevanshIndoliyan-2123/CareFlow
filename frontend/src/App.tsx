import { Routes, Route, Navigate } from 'react-router-dom';
import { HealthcarePlatform } from './components/HealthcarePlatform';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import { ClaimHistoryPage } from './pages/ClaimHistoryPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main Verification Portal (Protected) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HealthcarePlatform />
          </ProtectedRoute>
        }
      />

      {/* Claim History Route (Protected) */}
      <Route
        path="/claim-history"
        element={
          <ProtectedRoute>
            <ClaimHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims"
        element={
          <ProtectedRoute>
            <ClaimHistoryPage />
          </ProtectedRoute>
        }
      />

      {/* User Profile Route (Protected) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Clinical Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Direct Shareable Document Verification URL */}
      <Route
        path="/documents/:id"
        element={
          <ProtectedRoute>
            <DocumentDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback to root (which redirects to /login if unauthenticated) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
