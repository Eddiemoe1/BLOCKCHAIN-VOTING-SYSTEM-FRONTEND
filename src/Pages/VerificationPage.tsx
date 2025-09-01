import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Badge } from '../Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Components/ui/tabs';
import { toast } from '../hooks/use-toast';
import { mockVoteHistory, mockElections, VoteHistory, Election } from '../MockData';
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Hash,
  ExternalLink,
  FileText,
  Lock,
  Eye,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface VerificationResult {
  status: 'verified' | 'not_found' | 'election_verified' | 'election_not_found';
  vote?: VoteHistory;
  election?: Election;
  blockData?: {
    blockNumber: number;
    timestamp: Date;
    gasUsed: string;
    confirmations: number;
    minerFee: string;
  };
  integrity?: {
    contractVerified: boolean;
    votesIntact: boolean;
    resultsAccurate: boolean;
    auditPassed: boolean;
  };
  message?: string;
}

const VerificationPage = () => {
  const [transactionHash, setTransactionHash] = useState('');
  const [electionId, setElectionId] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyTransaction = async () => {
    if (!transactionHash.trim()) {
      toast({
        title: "Transaction hash required",
        description: "Please enter a transaction hash to verify",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate blockchain verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock verification logic
    const foundVote = mockVoteHistory.find(vote => 
      vote.transactionHash.toLowerCase() === transactionHash.toLowerCase()
    );
    
    if (foundVote) {
      const election = mockElections.find(e => e.id === foundVote.electionId);
      setVerificationResult({
        status: 'verified',
        vote: foundVote,
        election: election,
        blockData: {
          blockNumber: foundVote.blockNumber,
          timestamp: foundVote.timestamp,
          gasUsed: foundVote.gasUsed,
          confirmations: 125,
          minerFee: '0.002 ETH'
        }
      });
      
      toast({
        title: "Vote verified successfully!",
        description: "This vote is authentic and recorded on the blockchain",
      });
    } else {
      setVerificationResult({
        status: 'not_found',
        message: 'Transaction not found or invalid hash'
      });
      
      toast({
        title: "Verification failed",
        description: "Transaction not found or hash is invalid",
        variant: "destructive"
      });
    }
    
    setIsVerifying(false);
  };

  const verifyElection = async () => {
    if (!electionId.trim()) {
      toast({
        title: "Election ID required",
        description: "Please enter an election ID to verify",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const election = mockElections.find(e => e.id === electionId);
    
    if (election) {
      setVerificationResult({
        status: 'election_verified',
        election: election,
        integrity: {
          contractVerified: true,
          votesIntact: true,
          resultsAccurate: true,
          auditPassed: true
        }
      });
      
      toast({
        title: "Election verified!",
        description: "Election integrity confirmed on blockchain",
      });
    } else {
      setVerificationResult({
        status: 'election_not_found',
        message: 'Election not found with this ID'
      });
      
      toast({
        title: "Election not found",
        description: "No election found with this ID",
        variant: "destructive"
      });
    }
    
    setIsVerifying(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Blockchain Verification</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Verify the authenticity and integrity of votes and elections on the blockchain. 
          Every transaction is immutable and publicly verifiable.
        </p>
      </div>

      {/* Verification Tools */}
      <Tabs defaultValue="transaction" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
          <TabsTrigger value="transaction" className="data-[state=active]:bg-slate-700">
            Verify Transaction
          </TabsTrigger>
          <TabsTrigger value="election" className="data-[state=active]:bg-slate-700">
            Verify Election
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transaction" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Hash className="w-5 h-5" />
                <span>Transaction Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="txHash" className="text-slate-300">
                  Transaction Hash
                </Label>
                <Input
                  id="txHash"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  placeholder="0xa1b2c3d4e5f6789012345678901234567890abcdef..."
                  className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 font-mono"
                />
                <p className="text-xs text-slate-400">
                  Enter the transaction hash from your vote receipt
                </p>
              </div>
              
              <Button
                onClick={verifyTransaction}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Verify Transaction
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="election" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <FileText className="w-5 h-5" />
                <span>Election Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="electionId" className="text-slate-300">
                  Election ID
                </Label>
                <Input
                  id="electionId"
                  value={electionId}
                  onChange={(e) => setElectionId(e.target.value)}
                  placeholder="e.g., 1, 2, 3..."
                  className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                />
                <p className="text-xs text-slate-400">
                  Enter the election ID to verify its integrity
                </p>
              </div>
              
              <Button
                onClick={verifyElection}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Verify Election
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Verification Results */}
      {verificationResult && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Eye className="w-5 h-5" />
              <span>Verification Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {verificationResult.status === 'verified' && (
              <div className="space-y-6">
                {/* Verification Status */}
                <div className="flex items-center space-x-3 p-4 bg-green-600/10 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-400">Vote Successfully Verified</h3>
                    <p className="text-green-200 text-sm">
                      This vote is authentic and has been permanently recorded on the blockchain
                    </p>
                  </div>
                </div>

                {/* Vote Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Vote Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Election:</span>
                        <span className="text-white font-medium">
                          {verificationResult.election?.title}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Candidate:</span>
                        <span className="text-white font-medium">
                          {verificationResult.vote?.candidateName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Vote Time:</span>
                        <span className="text-white">
                          {verificationResult.vote && formatDate(verificationResult.vote.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Transaction:</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 h-6 px-2"
                          onClick={() => window.open(`https://etherscan.io/tx/${verificationResult.vote?.transactionHash}`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Blockchain Data</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Block Number:</span>
                        <span className="text-white font-mono">
                          {verificationResult.blockData?.blockNumber.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Confirmations:</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {verificationResult.blockData?.confirmations}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Gas Used:</span>
                        <span className="text-white">{verificationResult.blockData?.gasUsed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Miner Fee:</span>
                        <span className="text-white">{verificationResult.blockData?.minerFee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {verificationResult.status === 'election_verified' && (
              <div className="space-y-6">
                {/* Verification Status */}
                <div className="flex items-center space-x-3 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400">Election Successfully Verified</h3>
                    <p className="text-blue-200 text-sm">
                      Election integrity confirmed - all systems operational
                    </p>
                  </div>
                </div>

                {/* Election Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Election Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Title:</span>
                        <span className="text-white font-medium">
                          {verificationResult.election?.title}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Status:</span>
                        <Badge className={
                          verificationResult.election?.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }>
                          {verificationResult.election?.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Total Votes:</span>
                        <span className="text-white">
                          {verificationResult.election?.totalVotes.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Contract:</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 h-6 px-2"
                          onClick={() => window.open(`https://etherscan.io/address/${verificationResult.election?.contractAddress}`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Integrity Checks</h4>
                    <div className="space-y-3">
                      {verificationResult.integrity && Object.entries(verificationResult.integrity).map(([check, passed]) => (
                        <div key={check} className="flex items-center justify-between">
                          <span className="text-slate-400 capitalize">
                            {check.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          {passed ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Passed
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              <XCircle className="w-3 h-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(verificationResult.status === 'not_found' || verificationResult.status === 'election_not_found') && (
              <div className="flex items-center space-x-3 p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-lg font-semibold text-red-400">Verification Failed</h3>
                  <p className="text-red-200 text-sm">{verificationResult.message}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Lock className="w-5 h-5" />
              <span>How Verification Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-bold">1</span>
                </div>
                <p>Every vote generates a unique cryptographic hash that's recorded on the blockchain</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-bold">2</span>
                </div>
                <p>The transaction is validated by network nodes and included in a block</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-bold">3</span>
                </div>
                <p>Once confirmed, the vote becomes immutable and publicly verifiable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Zap className="w-5 h-5" />
              <span>Security Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">256-bit cryptographic encryption</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Immutable blockchain records</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Decentralized network validation</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Public audit trail</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Zero-knowledge privacy protection</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;