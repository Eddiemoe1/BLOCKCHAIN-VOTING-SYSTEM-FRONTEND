import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';
import { Input } from '../Components/ui/input';
import { mockVoteHistory, mockElections } from '../MockData';
import type { VoteHistory } from '../MockData';
import { useWallet } from '../Contexts/WalletContext';
import './VoteHistory.css';
import {
  History,
  Search,
  ExternalLink,
  CheckCircle,
  Clock,
  Shield,
  Vote,
  Calendar,
  Hash
} from 'lucide-react';

const VoteHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [voteHistory] = useState<VoteHistory[]>(mockVoteHistory);
  const { wallet } = useWallet();

  const filteredHistory = voteHistory.filter(vote =>
    vote.electionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vote.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vote.transactionHash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  if (!wallet.connected) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <History className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-slate-400 mb-6">
          Connect your wallet to view your voting history
        </p>
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Vote History</h1>
          <p className="text-slate-400 mt-2">
            Your complete voting record on the blockchain
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Connected Wallet</p>
          <p className="text-white font-mono text-sm">
            {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by election, candidate, or transaction hash..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Votes Cast</p>
                <p className="text-2xl font-bold text-white">{voteHistory.length}</p>
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
                <p className="text-sm text-slate-400 mb-1">Elections Participated</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(voteHistory.map(v => v.electionId)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Verification Status</p>
                <p className="text-2xl font-bold text-green-400">100%</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vote History */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <History className="w-5 h-5" />
            <span>Your Voting History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No votes found</h3>
              <p className="text-slate-400">
                {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t cast any votes yet'}
              </p>
            </div>
          ) : (
            filteredHistory.map((vote) => (
              <div
                key={vote.id}
                className="p-4 bg-slate-900/30 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-white">
                        {vote.electionTitle}
                      </h3>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmed
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Vote className="w-4 h-4" />
                          <span>Voted for: <span className="text-white font-medium">{vote.candidateName}</span></span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(vote.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Hash className="w-4 h-4" />
                          <span>Block: <span className="text-white font-mono">{vote.blockNumber.toLocaleString()}</span></span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400">
                          <span>Gas Used: <span className="text-white">{vote.gasUsed}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-slate-800/50 rounded border border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400">Transaction Hash:</span>
                          <span className="text-xs font-mono text-slate-300">
                            {truncateHash(vote.transactionHash)}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-400 hover:bg-slate-700 h-6 px-2"
                          onClick={() => window.open(`https://etherscan.io/tx/${vote.transactionHash}`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Verification Notice */}
      <Card className="bg-blue-600/10 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Blockchain Verification
              </h3>
              <p className="text-blue-200 text-sm mb-4">
                All your votes are permanently recorded on the blockchain and can be independently verified. 
                Each vote is cryptographically secured and immutable, ensuring complete transparency and integrity.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>All votes verified</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-400">
                  <Shield className="w-4 h-4" />
                  <span>256-bit encryption</span>
                </div>
                <div className="flex items-center space-x-1 text-purple-400">
                  <Hash className="w-4 h-4" />
                  <span>Immutable records</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoteHistoryPage;