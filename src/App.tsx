import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { GlobalStateProvider } from './context/GlobalStateContext';
import { ErrorProvider } from './context/ErrorContext';
import { ColorPaletteProvider } from './context/ColorPaletteContext';
import './index.css';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  return (
    <ErrorProvider>
      <GlobalStateProvider>
        <ThemeProvider>
          <AuthProvider>
            <ColorPaletteProvider>
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Cargando Sistema...</div>}>
                  <Routes>
                    <Route
                      path="/login"
                      element={<Login />}
                    />
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </Router>
            </ColorPaletteProvider>
          </AuthProvider>
        </ThemeProvider>
      </GlobalStateProvider>
    </ErrorProvider>
  );
}

export default App;
