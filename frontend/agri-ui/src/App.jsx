import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SoilAnalysis from './pages/SoilAnalysis';
import DiseaseDetection from './pages/DiseaseDetection';
import AuthPage from './pages/AuthPage';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/signin', '/signup'];
  const isAuthPage = hideNavbarRoutes.includes(location.pathname);
  const isResetPasswordPage = location.pathname.startsWith('/reset-password');

  const showNavbar = !isAuthPage && !isResetPasswordPage;

  return (
    <>
      {/* Premium Dark Gradient Background replacing the global LiquidEther */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, background: '#0A0D0B' }}></div>
      <div style={{ position: 'fixed', top: '-50%', left: '-20%', width: '140vw', height: '140vh', zIndex: -1, background: 'radial-gradient(circle at 50% 0%, rgba(39, 174, 96, 0.12) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
      
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {showNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/soil" element={<ProtectedRoute><SoilAnalysis /></ProtectedRoute>} />
          <Route path="/disease" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;