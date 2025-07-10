import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import { routes } from './pages/routes';

function App() {
  return (
    <Router basename="/clinic">
      <Layout>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={route.element}
            />
          ))}
          {/* 確保任何未匹配的路由都重定向到首頁 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;