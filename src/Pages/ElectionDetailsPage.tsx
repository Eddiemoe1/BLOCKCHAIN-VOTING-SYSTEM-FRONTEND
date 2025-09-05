import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';
import { Progress } from '../Components/ui/progress';
import { toast } from '../hooks/use-toast';
import { mockElections, mockVoteForCandidate } from '../MockData';
import type {Election} from '../MockData'
import { useWallet } from '../Contexts/WalletContext';
import {
  ArrowLeft,
  Calendar,
  Users,
  Shield,
  ExternalLink,
  CheckCircle,
  Clock,
  TrendingUp,
  Vote,
  User,
  Award,
  BarChart
} from 'lucide-react';

const ElectionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const [election, setElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const foundElection = mockElections.find(e => e.id === id);
    setElection(foundElection || null);
  }, [id]);

  if (!election) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Vote className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Election not found</h3>
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="border-slate-600 text-slate-400 hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Elections
        </Button>
      </div>
    );
  }

  const handleVote = async () => {
    if (!wallet.connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCandidate) {
      toast({
        title: "No candidate selected",
        description: "Please select a candidate to vote for",
        variant: "destructive"
      });
      return;
    }

    if (election.status !== 'active') {
      toast({
        title: "Voting not available",
        description: "This election is not currently active",
        variant: "destructive"
      });
      return;
    }

    setIsVoting(true);

    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const result = mockVoteForCandidate(election.id, selectedCandidate);
    
    if (result.success) {
      // Update local state
      const updatedElection = mockElections.find(e => e.id === id);
      if (updatedElection) {
        setElection({ ...updatedElection });
      }
      
      toast({
        title: "Vote cast successfully!",
        description: `Your vote for ${selectedCandidate} has been recorded on the blockchain`,
      });
      
      setSelectedCandidate(null);
    } else {
      toast({
        title: "Vote failed",
        description: result.error,
        variant: "destructive"
      });
    }

    setIsVoting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVotingProgress = () => {
    return (election.totalVotes / election.eligibleVoters) * 100;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="border-slate-600 text-slate-400 hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-white">{election.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Election Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-white mb-2">
                    {election.title}
                  </CardTitle>
                  <p className="text-slate-400">{election.description}</p>
                </div>
                <Badge className={`flex items-center space-x-1 ${getStatusColor(election.status)}`}>
                  {getStatusIcon(election.status)}
                  <span className="capitalize">{election.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Start: {formatDate(election.startDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>End: {formatDate(election.endDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Shield className="w-4 h-4" />
                  <span>Network: {election.blockchainNetwork}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <ExternalLink className="w-4 h-4" />
                  <button 
                    onClick={() => window.open(`https://etherscan.io/address/${election.contractAddress}`, '_blank')}
                    className="hover:text-blue-400 transition-colors"
                  >
                    View Contract
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Users className="w-5 h-5" />
                <span>Candidates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {election.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedCandidate === candidate.id
                      ? 'border-blue-500 bg-blue-600/10'
                      : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                  }`}
                  onClick={() => election.status === 'active' && setSelectedCandidate(candidate.id)}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={candidate.profileImage}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {candidate.name}
                          </h3>
                          <p className="text-sm text-slate-400 mb-2">
                            {candidate.party}
                          </p>
                          <p className="text-sm text-slate-300 mb-3">
                            {candidate.bio}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {candidate.policies.map((policy, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-slate-700 text-slate-300"
                              >
                                {policy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          {election.totalVotes > 0 && (
                            <>
                              <p className="text-2xl font-bold text-blue-400">
                                {candidate.percentage.toFixed(1)}%
                              </p>
                              <p className="text-sm text-slate-400">
                                {candidate.votes.toLocaleString()} votes
                              </p>
                              <Progress 
                                value={candidate.percentage} 
                                className="mt-2 h-2 bg-slate-700 w-24"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Vote Button */}
              {election.status === 'active' && (
                <div className="pt-4 border-t border-slate-700">
                  <Button
                    onClick={handleVote}
                    disabled={!selectedCandidate || isVoting || !wallet.connected}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                    size="lg"
                  >
                    {isVoting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing Vote...
                      </>
                    ) : (
                      <>
                        <Vote className="w-5 h-5 mr-2" />
                        Cast Your Vote
                      </>
                    )}
                  </Button>
                  {!wallet.connected && (
                    <p className="text-sm text-slate-400 text-center mt-2">
                      Connect your wallet to vote
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Voting Stats */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BarChart className="w-5 h-5" />
                <span>Voting Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Votes</span>
                  <span className="text-white font-medium">
                    {election.totalVotes.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Eligible Voters</span>
                  <span className="text-white font-medium">
                    {election.eligibleVoters.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={getVotingProgress()} 
                  className="h-3 bg-slate-700"
                />
                <div className="text-xs text-slate-500 text-center">
                  {getVotingProgress().toFixed(1)}% turnout
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Network</span>
                  <span className="text-white">{election.blockchainNetwork}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Gas Price</span>
                  <span className="text-white">25 gwei</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Confirmations</span>
                  <span className="text-green-400">12/12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => window.open(`https://etherscan.io/address/${election.contractAddress}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Blockchain
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Verify Vote
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <BarChart className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ElectionDetailsPage;