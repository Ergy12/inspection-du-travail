import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ComplaintSubmission } from './pages/ComplaintSubmission';
import { ComplaintTracking } from './pages/ComplaintTracking';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProvinceManagement } from './pages/admin/ProvinceManagement';
import { DirectionManagement } from './pages/admin/DirectionManagement';
import { BranchManagement } from './pages/admin/BranchManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { ComplaintManagement } from './pages/admin/ComplaintManagement';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/submit-complaint" 
            element={<ComplaintSubmission onBack={() => window.history.back()} />} 
          />
          <Route 
            path="/track-complaint" 
            element={<ComplaintTracking onBack={() => window.history.back()} />} 
          />

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute roles={['super_admin', 'admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/provinces" element={<ProvinceManagement />} />
              <Route path="/admin/directions" element={<DirectionManagement />} />
              <Route path="/admin/branches" element={<BranchManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>
          </Route>

          {/* Protected complaint manager routes */}
          <Route 
            element={
              <ProtectedRoute 
                roles={['super_admin', 'admin', 'complaint_manager', 'inspector']} 
              />
            }
          >
            <Route element={<AdminLayout />}>
              <Route path="/complaints" element={<ComplaintManagement />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;