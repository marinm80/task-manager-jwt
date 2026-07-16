import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './components/PrivateRoute';
import SessionBootstrap from './components/SessionBootstrap';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<SessionBootstrap />}>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route element={<PrivateRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>
      {/* D-04: el wildcard apunta a "/" (landing) en vez de "/login". */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
