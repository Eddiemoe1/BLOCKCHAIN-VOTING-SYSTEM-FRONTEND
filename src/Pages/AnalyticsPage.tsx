import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Components/ui/select';
import { Progress } from '../Components/ui/progress';
import { Badge } from '../Components/ui/badge';
import { mockElections, mockNetworkStats } from '../MockData';
import {
  BarChart3,
  TrendingUp,
  Users,
  Vote,
  Calendar,
  Shield,
  Activity,
  PieChart,
  LineChart,
  Target
} from 'lucide-react';

// Define types for our data structures
interface Election {
  id: string;
  title: string;
  totalVotes: number;
  eligibleVoters: number;
  status: 'active' | 'completed' | 'upcoming';
}

interface NetworkStats {
  networkUptime: string;
  blockchainTransactions: number;
  averageGasPrice: number;
}

interface VotingTrend {
  hour: number;
  votes: number;
}

interface ElectionStats {
  totalVotes: number;
  totalEligible: number;
  avgTurnout: number;
  activeElections: number;
}

interface TopElection extends Election {
  turnout: number;
}

const AnalyticsPage: React.FC = () => {
  const [selectedElection, setSelectedElection] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30d');

  const stats: ElectionStats = useMemo(() => {
    if (selectedElection === 'all') {
      return {
        totalVotes: mockElections.reduce((sum: number, e: Election) => sum + e.totalVotes, 0),
        totalEligible: mockElections.reduce((sum: number, e: Election) => sum + e.eligibleVoters, 0),
        avgTurnout: mockElections.reduce((sum: number, e: Election) => sum + (e.totalVotes / e.eligibleVoters), 0) / mockElections.length * 100,
        activeElections: mockElections.filter((e: Election) => e.status === 'active').length
      };
    } else {
      const election = mockElections.find((e: Election) => e.id === selectedElection);
      if (!election) {
        return {
          totalVotes: 0,
          totalEligible: 0,
          avgTurnout: 0,
          activeElections: 0
        };
      }
      return {
        totalVotes: election.totalVotes,
        totalEligible: election.eligibleVoters,
        avgTurnout: (election.totalVotes / election.eligibleVoters) * 100,
        activeElections: election.status === 'active' ? 1 : 0
      };
    }
  }, [selectedElection]);

  const topElections: TopElection[] = useMemo(() => {
    return mockElections
      .map((election: Election) => ({
        ...election,
        turnout: (election.totalVotes / election.eligibleVoters) * 100
      }))
      .sort((a: TopElection, b: TopElection) => b.turnout - a.turnout)
      .slice(0, 5);
  }, [mockElections]);

  const votingTrends: VotingTrend[] = useMemo(() => {
    // Mock hourly voting data for the last 24 hours
    return Array.from({ length: 24 }, (_, i: number) => ({
      hour: i,
      votes: Math.floor(Math.random() * 100) + 20
    }));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <div className="flex space-x-4">
          <Select value={selectedElection} onValueChange={setSelectedElection}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Elections</SelectItem>
              {mockElections.map((election: Election) => (
                <SelectItem key={election.id} value={election.id}>
                  {election.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Votes</p>
                <p className="text-2xl font-bold text-white">{stats.totalVotes.toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-1">↑ 12.5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Vote className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Voter Turnout</p>
                <p className="text-2xl font-bold text-white">{stats.avgTurnout.toFixed(1)}%</p>
                <p className="text-xs text-green-400 mt-1">↑ 3.2% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Active Elections</p>
                <p className="text-2xl font-bold text-white">{stats.activeElections}</p>
                <p className="text-xs text-slate-400 mt-1">Currently running</p>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-400" />
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
                <p className="text-xs text-green-400 mt-1">Excellent reliability</p>
              </div>
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voting Trends Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <LineChart className="w-5 h-5" />
              <span>Voting Activity (Last 24 Hours)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2">
                {votingTrends.slice(0, 12).map((data: VotingTrend, index: number) => (
                  <div key={index} className="text-center">
                    <div 
                      className="bg-blue-600/30 rounded-t-sm mb-1 mx-auto"
                      style={{ 
                        height: `${(data.votes / 120) * 80}px`,
                        width: '20px'
                      }}
                    />
                    <p className="text-xs text-slate-400">{data.hour}:00</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Peak Hour:</span>
                  <span className="text-white">14:00 (89 votes)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Average/Hour:</span>
                  <span className="text-white">52 votes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Elections */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Target className="w-5 h-5" />
              <span>Top Performing Elections</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topElections.map((election: TopElection, index: number) => (
              <div key={election.id} className="flex items-center space-x-4 p-3 bg-slate-900/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{election.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={election.turnout} className="h-1 bg-slate-700 flex-1" />
                    <span className="text-xs text-blue-400 font-medium">
                      {election.turnout.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {election.totalVotes.toLocaleString()} / {election.eligibleVoters.toLocaleString()} votes
                  </p>
                </div>
                <Badge className={`${
                  election.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  election.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {election.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Demographics */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Users className="w-5 h-5" />
              <span>Voter Demographics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">18-29 years</span>
                <span className="text-sm text-white">28%</span>
              </div>
              <Progress value={28} className="h-2 bg-slate-700" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">30-44 years</span>
                <span className="text-sm text-white">35%</span>
              </div>
              <Progress value={35} className="h-2 bg-slate-700" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">45-59 years</span>
                <span className="text-sm text-white">25%</span>
              </div>
              <Progress value={25} className="h-2 bg-slate-700" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">60+ years</span>
                <span className="text-sm text-white">12%</span>
              </div>
              <Progress value={12} className="h-2 bg-slate-700" />
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Statistics */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Shield className="w-5 h-5" />
              <span>Blockchain Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Transactions</span>
                <span className="text-sm text-white">{mockNetworkStats.blockchainTransactions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Avg Gas Price</span>
                <span className="text-sm text-white">{mockNetworkStats.averageGasPrice} gwei</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Block Time</span>
                <span className="text-sm text-white">12.5s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Confirmations</span>
                <span className="text-sm text-green-400">12/12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { action: 'Vote cast', election: 'Presidential Election', time: '2 min ago' },
              { action: 'Election created', election: 'City Council', time: '15 min ago' },
              { action: 'Results updated', election: 'School Board', time: '1 hour ago' },
              { action: 'Verification completed', election: 'Senate Race', time: '2 hours ago' }
            ].map((activity, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-slate-900/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.election}</p>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;