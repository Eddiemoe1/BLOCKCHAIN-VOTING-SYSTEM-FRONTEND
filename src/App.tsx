import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './Contexts/WalletContext';
import Navbar from './Components/Navbar';
import Homepage from './Pages/Homepage';
import ElectionDetailsPage from './Pages/ElectionDetailsPage';
import CreateElectionPage from './Pages/CreateElectionPage';
import AnalyticsPage from './Pages/AnalyticsPage';
import VoteHistoryPage from './Pages/VoteHistoryPage';
import VerificationPage from './Pages/VerificationPage';
import ElectionCard from './Components/ElectionCard';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="App min-h-screen bg-slate-900">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/election/:id" element={<ElectionDetailsPage />} />
              <Route path="/create" element={<CreateElectionPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/history" element={<VoteHistoryPage />} />
              <Route path="/verification" element={<VerificationPage />} />
              <Route path="/election-card" element={<ElectionCard />} />

            </Routes>
          </main>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;