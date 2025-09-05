import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10" />
        <div className="relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Secure Blockchain
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {' '}Voting Platform
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
              Transparent, immutable, and decentralized elections powered by blockchain technology. 
              Your vote, your voice, secured forever.
            </p>
            
            {!wallet.connected && (
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet to Vote
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Learn More
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-blue-500/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-40 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl" />
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Elections</p>
                <p className="text-2xl font-bold text-white">{mockNetworkStats.totalElections}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Votes Cast</p>
                <p className="text-2xl font-bold text-white">{mockNetworkStats.totalVotes.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Vote className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Active Voters</p>
                <p className="text-2xl font-bold text-white">{mockNetworkStats.activeVoters.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Network Uptime</p>
                <p className="text-2xl font-bold text-white">{mockNetworkStats.networkUptime}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search elections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className={statusFilter === 'all' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'border-slate-600 text-slate-400 hover:bg-slate-700'}
          >
            All ({elections.length})
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
            className={statusFilter === 'active' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'border-slate-600 text-slate-400 hover:bg-slate-700'}
          >
            Active ({getStatusCount('active')})
          </Button>
          <Button
            variant={statusFilter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('upcoming')}
            className={statusFilter === 'upcoming' 
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
              : 'border-slate-600 text-slate-400 hover:bg-slate-700'}
          >
            Upcoming ({getStatusCount('upcoming')})
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('completed')}
            className={statusFilter === 'completed' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'border-slate-600 text-slate-400 hover:bg-slate-700'}
          >
            Completed ({getStatusCount('completed')})
          </Button>
        </div>
      </div>

      {/* Elections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredElections.map((election) => (
          <ElectionCard key={election.id} election={election} />
        ))}
      </div>

      {filteredElections.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No elections found</h3>
          <p className="text-slate-400">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Recent Activity Feed */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Activity className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockActivityFeed.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-slate-900/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="text-xs text-slate-400">
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