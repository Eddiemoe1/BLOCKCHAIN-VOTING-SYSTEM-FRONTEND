import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import ElectionCard from '../Components/ElectionCard';
import type { Election } from '../MockData'; 
import { mockElections, mockNetworkStats, mockActivityFeed } from '../MockData'; 
import { useWallet } from '../Contexts/WalletContext';
import './homepage.css';
import {
  Search,
  TrendingUp,
  Users,
  Vote,
  Activity,
  BarChart3,
  Shield,
  Zap,
  Wallet
} from 'lucide-react';

const HomePage = () => {
  const [elections] = useState<Election[]>(mockElections);
  const [filteredElections, setFilteredElections] = useState<Election[]>(mockElections);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const { wallet } = useWallet();

  useEffect(() => {
    let filtered = elections;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(election =>
        election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        election.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(election => election.status === statusFilter);
    }

    setFilteredElections(filtered);
  }, [elections, searchTerm, statusFilter]);

  const getStatusCount = (status: 'active' | 'upcoming' | 'completed'): number => {
    return elections.filter(e => e.status === status).length;
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-text-container">
            <h1 className="hero-title">
              Secure Blockchain
              <span className="hero-highlight">
                {' '}Voting Platform
              </span>
            </h1>
            <p className="hero-description">
              Transparent, immutable, and decentralized elections powered by blockchain technology. 
              Your vote, your voice, secured forever.
            </p>
            
            {!wallet.connected && (
              <div className="hero-buttons">
                <Button 
                  size="lg"
                  className="connect-wallet-btn"
                >
                  <Wallet className="btn-icon" />
                  Connect Wallet to Vote
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="learn-more-btn"
                >
                  Learn More
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="floating-element floating-element-1" />
        <div className="floating-element floating-element-2" />
      </div>

      {/* Network Stats */}
      <div className="stats-grid">
        <Card className="stat-card">
          <CardContent className="stat-card-content">
            <div className="stat-card-inner">
              <div>
                <p className="stat-label">Total Elections</p>
                <p className="stat-value">{mockNetworkStats.totalElections}</p>
              </div>
              <div className="stat-icon-container stat-icon-1">
                <BarChart3 className="stat-icon" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="stat-card-content">
            <div className="stat-card-inner">
              <div>
                <p className="stat-label">Total Votes Cast</p>
                <p className="stat-value">{mockNetworkStats.totalVotes.toLocaleString()}</p>
              </div>
              <div className="stat-icon-container stat-icon-2">
                <Vote className="stat-icon" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="stat-card-content">
            <div className="stat-card-inner">
              <div>
                <p className="stat-label">Active Voters</p>
                <p className="stat-value">{mockNetworkStats.activeVoters.toLocaleString()}</p>
              </div>
              <div className="stat-icon-container stat-icon-3">
                <Users className="stat-icon" />
              </div>
            </div>
          </CardContent>
        </Card>
        

        <Card className="stat-card">
          <CardContent className="stat-card-content">
            <div className="stat-card-inner">
              <div>
                <p className="stat-label">Network Uptime</p>
                <p className="stat-value">{mockNetworkStats.networkUptime}</p>
              </div>
              <div className="stat-icon-container stat-icon-4">
                <Shield className="stat-icon" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-container">
        <div className="search-container">
          <Search className="search-icon" />
          <Input
            placeholder="Search elections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className={`filter-btn ${statusFilter === 'all' ? 'filter-btn-active' : ''}`}
          >
            All ({elections.length})
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
            className={`filter-btn ${statusFilter === 'active' ? 'filter-btn-active filter-btn-active-green' : ''}`}
          >
            Active ({getStatusCount('active')})
          </Button>
          <Button
            variant={statusFilter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('upcoming')}
            className={`filter-btn ${statusFilter === 'upcoming' ? 'filter-btn-active filter-btn-active-yellow' : ''}`}
          >
            Upcoming ({getStatusCount('upcoming')})
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('completed')}
            className={`filter-btn ${statusFilter === 'completed' ? 'filter-btn-active' : ''}`}
          >
            Completed ({getStatusCount('completed')})
          </Button>
        </div>
      </div>

      {/* Elections Grid */}
      <div className="elections-grid">
        {filteredElections.map((election) => (
          <ElectionCard key={election.id} election={election} />
        ))}
      </div>

      {filteredElections.length === 0 && (
        <div className="no-elections">
          <div className="no-elections-icon">
            <Search className="no-elections-search-icon" />
          </div>
          <h3 className="no-elections-title">No elections found</h3>
          <p className="no-elections-text">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Recent Activity Feed */}
      <Card className="activity-card">
        <CardHeader>
          <CardTitle className="activity-title">
            <Activity className="activity-title-icon" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="activity-content">
          {mockActivityFeed.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon-container">
                <Zap className="activity-icon" />
              </div>
              <div className="activity-details">
                <p className="activity-message">{activity.message}</p>
                <p className="activity-timestamp">
                  {activity.timestamp.toLocaleTimeString()} • {activity.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;