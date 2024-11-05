import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import './App.css';

// Protected Route with role check
const ProtectedRoute = ({ isAuthenticated, userRole, allowedRoles, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  // Initialize state from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });
  
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  // Update localStorage when auth state changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('userRole', userRole || '');
    localStorage.setItem('username', username);
  }, [isAuthenticated, userRole, username]);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUserRole(userData.role);
    setUsername(userData.username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              userRole={userRole}
              allowedRoles={['admin']}
            >
              <div className="min-h-screen bg-gray-100">
                {/* Navbar */}
                <nav className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold">Monee</h1>
                        <a href="/" className="text-gray-600 hover:text-gray-900">
                          Dashboard
                        </a>
                        {userRole === 'admin' && (
                          <a href="/admin/users" className="text-gray-600 hover:text-gray-900">
                            Manage Users
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {username} ({userRole})
                        </span>
                        <button
                          onClick={handleLogout}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </nav>
                
                {/* Main Content */}
                <UserManagement />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div className="min-h-screen bg-gray-100">
                {/* Navbar */}
                <nav className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold">Monee</h1>
                        <a href="/" className="text-gray-600 hover:text-gray-900">
                          Dashboard
                        </a>
                        {userRole === 'admin' && (
                          <a href="/admin/users" className="text-gray-600 hover:text-gray-900">
                            Manage Users
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {username} ({userRole})
                        </span>
                        <button
                          onClick={handleLogout}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </nav>
                
                {/* Main Content */}
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;