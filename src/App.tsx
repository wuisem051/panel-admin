import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { AdminWrapper } from './components/AdminWrapper';

import { SiteProvider } from './context/SiteContext';
import { ContentProvider } from './context/ContentContext';
import { AnalyticsProvider } from './context/AnalyticsContext';

const App: React.FC = () => {
  return (
    <AnalyticsProvider>
      <ContentProvider>
        <SiteProvider>
          <Theme appearance="inherit" radius="large" scaling="100%">
            <Router>
              <main className="min-h-screen font-inter">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <AdminWrapper>
                        <Dashboard />
                      </AdminWrapper>
                    }
                  />
                </Routes>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  newestOnTop
                  closeOnClick
                  pauseOnHover
                />
              </main>
            </Router>
          </Theme>
        </SiteProvider>
      </ContentProvider>
    </AnalyticsProvider>
  );
}

export default App;
