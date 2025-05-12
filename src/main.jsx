import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'; // This should be your landing page
import TabLayout from './TabLayout.jsx'; // Pricing dashboard

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />             {/* Landing Page */}
      <Route path="/tabs" element={<TabLayout />} />   {/* Price Dashboard */}
    </Routes>
  </BrowserRouter>
);
