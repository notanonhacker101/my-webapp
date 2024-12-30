import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginSeed from './pages/LoginSeed';
import CreateWallet from './pages/CreateWallet';
import Dashboard from './pages/Dashboard';
import CryptoDetail from './pages/CryptoDetail';
import Deposit from './pages/Deposit';
import Withdrawal from './pages/Withdrawal';
import VirtualCards from './pages/VirtualCards';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSeed />} />
        <Route path="/create-wallet" element={<CreateWallet />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crypto/:symbol" element={<CryptoDetail />} />

        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdrawal" element={<Withdrawal />} />

        <Route path="/virtual-cards" element={<VirtualCards />} />

        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
