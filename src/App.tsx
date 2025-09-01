import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ElectionDetailsPage from './pages/ElectionDetailsPage';
import CreateElectionPage from './pages/CreateElectionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import VoteHistoryPage from './pages/VoteHistoryPage';
import VerificationPage from './pages/VerificationPage';
import ElectionCard from '../Components/ElectionCard';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <div className="App min-h-screen bg-slate-950">
        <BrowserRouter>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/election/:id" element={<ElectionDetailsPage />} />
              <Route path="/create" element={<CreateElectionPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/history" element={<VoteHistoryPage />} />
              <Route path="/verification" element={<VerificationPage />} />
            </Routes>
          </main>
          <Toaster />
        </BrowserRouter>
      </div>
    </WalletProvider>
  );
}

export default App;