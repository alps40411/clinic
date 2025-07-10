import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;