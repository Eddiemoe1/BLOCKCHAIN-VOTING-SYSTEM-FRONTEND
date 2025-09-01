import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Shield,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Define types for our data structures
interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  percentage: number;
  profileImage: string;
}

interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'upcoming' | 'completed';
  totalVotes: number;
  eligibleVoters: number;
  blockchainNetwork: string;
  contractAddress: string;
  candidates: Candidate[];
}

interface ElectionCardProps {
  election: Election;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election }) => {
  const getStatusColor = (status: Election['status']): string => {
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

  const getStatusIcon = (status: Election['status']): React.ReactNode => {
    switch (status) {
      case 'active':
        return <TrendingUp className="w-3 h-3" />;
      case 'upcoming':
        return <Clock className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getVotingProgress = (): number => {
    return (election.totalVotes / election.eligibleVoters) * 100;
  };

  const getLeadingCandidate = (): Candidate => {
    return election.candidates.reduce((prev: Candidate, current: Candidate) => 
      prev.votes > current.votes ? prev : current
    );
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:border-slate-600 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {election.title}
            </CardTitle>
            <p className="text-sm text-slate-400 mb-3 line-clamp-2">
              {election.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(election.startDate)} - {formatDate(election.endDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>{election.blockchainNetwork}</span>
              </div>
            </div>
          </div>
          <Badge className={`flex items-center space-x-1 ${getStatusColor(election.status)}`}>
            {getStatusIcon(election.status)}
            <span className="capitalize">{election.status}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Voting Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Voting Progress</span>
            <span className="text-white font-medium">
              {election.totalVotes.toLocaleString()} / {election.eligibleVoters.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={getVotingProgress()} 
            className="h-2 bg-slate-700"
          />
          <div className="text-xs text-slate-500">
            {getVotingProgress().toFixed(1)}% turnout
          </div>
        </div>

        {/* Leading Candidate (if votes exist) */}
        {election.totalVotes > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-1">Currently Leading</p>
                <p className="text-sm font-medium text-white">
                  {getLeadingCandidate().name}
                </p>
                <p className="text-xs text-slate-500">
                  {getLeadingCandidate().party}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-400">
                  {getLeadingCandidate().percentage.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500">
                  {getLeadingCandidate().votes.toLocaleString()} votes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Preview */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium">
            Candidates ({election.candidates.length})
          </p>
          <div className="flex items-center space-x-2">
            {election.candidates.slice(0, 3).map((candidate: Candidate) => (
              <div
                key={candidate.id}
                className="flex items-center space-x-2 bg-slate-900/30 rounded-lg px-2 py-1 text-xs"
              >
                <img
                  src={candidate.profileImage}
                  alt={candidate.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-slate-300 truncate max-w-20">
                  {candidate.name}
                </span>
              </div>
            ))}
            {election.candidates.length > 3 && (
              <div className="text-xs text-slate-500">
                +{election.candidates.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          <Link to={`/election/${election.id}`} className="flex-1">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
              size="sm"
            >
              {election.status === 'active' ? 'Vote Now' : 'View Details'}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-400 hover:bg-slate-700"
            onClick={() => window.open(`https://etherscan.io/address/${election.contractAddress}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Contract Address */}
        <div className="text-xs text-slate-500 font-mono">
          Contract: {election.contractAddress.slice(0, 20)}...
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectionCard;