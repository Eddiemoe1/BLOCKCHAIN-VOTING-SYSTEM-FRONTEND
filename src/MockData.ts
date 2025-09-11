
// Type definitions
export interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  percentage: number;
  profileImage: string;
  bio: string;
  policies: string[];
}

export interface Election {
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

export interface VoteHistory {
  id: string;
  electionId: string;
  electionTitle: string;
  candidateId: string;
  candidateName: string;
  timestamp: Date;
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  confirmed: boolean;
}

export interface WalletData {
  address: string;
  balance: string;
  network: string;
  connected: boolean;
}

export interface NetworkStats {
  totalElections: number;
  totalVotes: number;
  activeVoters: number;
  blockchainTransactions: number;
  averageGasPrice: string;
  networkUptime: string;
}

export interface ActivityFeedItem {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  icon: string;
}

export interface VoteResult {
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  error?: string;
}

// Mock data
export const mockElections: Election[] = [
  {
    id: "1",
    title: "2024 Presidential Election",
    description: "Choose the next President of the United States",
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-11-30"),
    status: "active",
    totalVotes: 15420,
    eligibleVoters: 25000,
    blockchainNetwork: "Ethereum",
    contractAddress: "0x742d35Cc6532C58d64d7A5e37C74A16a",
    candidates: [
      {
        id: "c1",
        name: "Alexandra Chen",
        party: "Democratic Party",
        votes: 8650,
        percentage: 56.1,
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b796?w=400&h=400&fit=crop&crop=face",
        bio: "Former Governor with 15 years of public service experience.",
        policies: ["Healthcare Reform", "Climate Action", "Economic Growth"]
      },
      {
        id: "c2",
        name: "Marcus Thompson",
        party: "Republican Party",
        votes: 6770,
        percentage: 43.9,
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        bio: "Business leader and former military officer.",
        policies: ["Tax Reform", "Border Security", "Job Creation"]
      }
    ]
  },
  {
    id: "2",
    title: "City Council District 5",
    description: "Local representative for District 5 residents",
    startDate: new Date("2024-10-15"),
    endDate: new Date("2024-11-15"),
    status: "upcoming",
    totalVotes: 0,
    eligibleVoters: 8500,
    blockchainNetwork: "Polygon",
    contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    candidates: [
      {
        id: "c3",
        name: "Sarah Williams",
        party: "Independent",
        votes: 0,
        percentage: 0,
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        bio: "Community organizer and local business owner.",
        policies: ["Local Development", "Public Safety", "Education"]
      },
      {
        id: "c4",
        name: "Robert Martinez",
        party: "Progressive Coalition",
        votes: 0,
        percentage: 0,
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        bio: "Environmental lawyer and activist.",
        policies: ["Green Energy", "Affordable Housing", "Transportation"]
      }
    ]
  },
  {
    id: "3",
    title: "School Board Election",
    description: "Choose representatives for the school board",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2024-09-30"),
    status: "completed",
    totalVotes: 12750,
    eligibleVoters: 18000,
    blockchainNetwork: "Ethereum",
    contractAddress: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    candidates: [
      {
        id: "c5",
        name: "Jennifer Davis",
        party: "Education First",
        votes: 7650,
        percentage: 60.0,
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        bio: "Former teacher with 20 years of education experience.",
        policies: ["STEM Education", "Teacher Support", "Student Wellness"]
      },
      {
        id: "c6",
        name: "Michael Brown",
        party: "Parents Coalition",
        votes: 5100,
        percentage: 40.0,
        profileImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
        bio: "Parent advocate and former school board member.",
        policies: ["Parental Rights", "Budget Management", "Safety First"]
      }
    ]
  },

  {
    id: "3",
    title: "School Board Election",
    description: "Choose representatives for the school board",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2024-09-30"),
    status: "completed",
    totalVotes: 12750,
    eligibleVoters: 18000,
    blockchainNetwork: "Ethereum",
    contractAddress: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    candidates: [
      {
        id: "c5",
        name: "Jennifer Davis",
        party: "Education First",
        votes: 7650,
        percentage: 60.0,
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        bio: "Former teacher with 20 years of education experience.",
        policies: ["STEM Education", "Teacher Support", "Student Wellness"]
      },
      {
        id: "c6",
        name: "Michael Brown",
        party: "Parents Coalition",
        votes: 5100,
        percentage: 40.0,
        profileImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
        bio: "Parent advocate and former school board member.",
        policies: ["Parental Rights", "Budget Management", "Safety First"]
      }
    ]
  }
];

export const mockVoteHistory: VoteHistory[] = [
  {
    id: "vh1",
    electionId: "3",
    electionTitle: "School Board Election",
    candidateId: "c5",
    candidateName: "Jennifer Davis",
    timestamp: new Date("2024-09-15T14:30:00"),
    transactionHash: "0xa1b2c3d4e5f6789012345678901234567890abcdef",
    blockNumber: 18456789,
    gasUsed: "21000",
    confirmed: true
  },
  {
    id: "vh2",
    electionId: "1",
    electionTitle: "2024 Presidential Election",
    candidateId: "c1",
    candidateName: "Alexandra Chen",
    timestamp: new Date("2024-11-05T09:15:00"),
    transactionHash: "0xb2c3d4e5f6789012345678901234567890abcdef1a",
    blockNumber: 18756432,
    gasUsed: "22500",
    confirmed: true
  }
];

export const mockWalletData: WalletData = {
  address: "0x742d35Cc6532C58d64d7A5e37C74A16a",
  balance: "2.45",
  network: "Ethereum Mainnet",
  connected: false
};

export const mockNetworkStats: NetworkStats = {
  totalElections: 156,
  totalVotes: 89420,
  activeVoters: 12500,
  blockchainTransactions: 156780,
  averageGasPrice: "25",
  networkUptime: "99.97%"
};

export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: "a1",
    type: "vote_cast",
    message: "New vote cast in Presidential Election",
    timestamp: new Date("2024-11-05T15:30:00"),
    icon: "Vote"
  },
  {
    id: "a2",
    type: "election_created",
    message: "New election created: Senate District 12",
    timestamp: new Date("2024-11-05T14:15:00"),
    icon: "Plus"
  },
  {
    id: "a3",
    type: "results_updated",
    message: "Real-time results updated for City Council",
    timestamp: new Date("2024-11-05T13:45:00"),
    icon: "TrendingUp"
  },
  {
    id: "a4",
    type: "verification",
    message: "Blockchain verification completed",
    timestamp: new Date("2024-11-05T12:30:00"),
    icon: "Shield"
  }

  
];

export const electionData: ElectionData = {
  title: "New Election",
  description: "Description here",
  startDate: new Date(),
  endDate: new Date(),
  eligibleVoters: 1000,
  blockchainNetwork: "Ethereum",
  candidates: []
};


// Helper functions for mock data manipulation
export const mockVoteForCandidate = (electionId: string, candidateId: string): VoteResult => {
  const election = mockElections.find(e => e.id === electionId);
  if (election && election.status === 'active') {
    const candidate = election.candidates.find(c => c.id === candidateId);
    if (candidate) {
      candidate.votes += 1;
      election.totalVotes += 1;
      
      // Recalculate percentages
      election.candidates.forEach(c => {
        c.percentage = (c.votes / election.totalVotes) * 100;
      });
      
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000
      };
    }
  }
  return { success: false, error: "Invalid vote" };
};

export interface ElectionData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  eligibleVoters: number;
  blockchainNetwork: string;
  candidates: Omit<Candidate, 'id' | 'votes' | 'percentage'>[];
}

export const mockCreateElection = (electionData: ElectionData): Election => {
  const newElection: Election = {
    id: (mockElections.length + 1).toString(),
    ...electionData,
    totalVotes: 0,
    status: 'upcoming',
    contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
    candidates: electionData.candidates.map((candidate, index) => ({
      id: `c${Date.now()}_${index}`,
      ...candidate,
      votes: 0,
      percentage: 0
    }))
  };
  
  mockElections.unshift(newElection);
  return newElection;
};