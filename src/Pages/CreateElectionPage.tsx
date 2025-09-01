import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Textarea } from '../Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Components/ui/select';
import { Label } from '../Components/ui/label';
import { Badge } from '../Components/ui/badge';
import { toast } from '../hooks/use-toast';
import { mockCreateElection, ElectionData } from '../MockData';
import { useWallet } from '../Contexts/WalletContext';
import {
  Plus,
  Trash2,
  Calendar,
  Users,
  Shield,
  PlusCircle,
  ArrowLeft,
  Save,
  Upload
} from 'lucide-react';

interface CandidateForm {
  name: string;
  party: string;
  bio: string;
  policies: string[];
  profileImage: string;
}

interface FormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eligibleVoters: string;
  blockchainNetwork: string;
  candidates: CandidateForm[];
}

const CreateElectionPage = () => {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    eligibleVoters: '',
    blockchainNetwork: 'Ethereum',
    candidates: [
      { 
        name: '', 
        party: '', 
        bio: '', 
        policies: [], 
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' 
      }
    ]
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCandidateChange = (index: number, field: keyof CandidateForm, value: string) => {
    const updatedCandidates = [...formData.candidates];
    updatedCandidates[index] = {
      ...updatedCandidates[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      candidates: updatedCandidates
    }));
  };

  const addCandidate = () => {
    setFormData(prev => ({
      ...prev,
      candidates: [
        ...prev.candidates,
        { 
          name: '', 
          party: '', 
          bio: '', 
          policies: [], 
          profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b796?w=400&h=400&fit=crop&crop=face' 
        }
      ]
    }));
  };

  const removeCandidate = (index: number) => {
    if (formData.candidates.length > 1) {
      const updatedCandidates = formData.candidates.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        candidates: updatedCandidates
      }));
    }
  };

  const addPolicy = (candidateIndex: number, policy: string) => {
    if (policy.trim() && !formData.candidates[candidateIndex].policies.includes(policy.trim())) {
      const updatedCandidates = [...formData.candidates];
      updatedCandidates[candidateIndex].policies.push(policy.trim());
      setFormData(prev => ({
        ...prev,
        candidates: updatedCandidates
      }));
    }
  };

  const removePolicy = (candidateIndex: number, policyIndex: number) => {
    const updatedCandidates = [...formData.candidates];
    updatedCandidates[candidateIndex].policies.splice(policyIndex, 1);
    setFormData(prev => ({
      ...prev,
      candidates: updatedCandidates
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return false;
    }
    if (!formData.description.trim()) {
      toast({ title: "Description is required", variant: "destructive" });
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      toast({ title: "Start and end dates are required", variant: "destructive" });
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast({ title: "End date must be after start date", variant: "destructive" });
      return false;
    }
    if (!formData.eligibleVoters || parseInt(formData.eligibleVoters) <= 0) {
      toast({ title: "Eligible voters must be greater than 0", variant: "destructive" });
      return false;
    }
    
    // Validate candidates
    for (let i = 0; i < formData.candidates.length; i++) {
      const candidate = formData.candidates[i];
      if (!candidate.name.trim()) {
        toast({ title: `Candidate ${i + 1} name is required`, variant: "destructive" });
        return false;
      }
      if (!candidate.party.trim()) {
        toast({ title: `Candidate ${i + 1} party is required`, variant: "destructive" });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an election",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsCreating(true);

    try {
      // Simulate blockchain deployment delay
      await new Promise(resolve => setTimeout(resolve, 4000));

      const electionData: ElectionData = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        eligibleVoters: parseInt(formData.eligibleVoters),
        blockchainNetwork: formData.blockchainNetwork,
        candidates: formData.candidates.map(candidate => ({
          name: candidate.name,
          party: candidate.party,
          bio: candidate.bio,
          policies: candidate.policies,
          profileImage: candidate.profileImage
        }))
      };

      const newElection = mockCreateElection(electionData);

      toast({
        title: "Election created successfully!",
        description: `Contract deployed at ${newElection.contractAddress}`,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Failed to create election",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
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
        <h1 className="text-3xl font-bold text-white">Create New Election</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <PlusCircle className="w-5 h-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Election Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., 2024 Presidential Election"
                  className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eligibleVoters" className="text-slate-300">Eligible Voters *</Label>
                <Input
                  id="eligibleVoters"
                  type="number"
                  value={formData.eligibleVoters}
                  onChange={(e) => handleInputChange('eligibleVoters', e.target.value)}
                  placeholder="e.g., 25000"
                  className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the purpose and scope of this election..."
                className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 min-h-20"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-300">Start Date *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-300">End Date *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="network" className="text-slate-300">Blockchain Network</Label>
                <Select 
                  value={formData.blockchainNetwork} 
                  onValueChange={(value) => handleInputChange('blockchainNetwork', value)}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="Polygon">Polygon</SelectItem>
                    <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="Optimism">Optimism</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-white">
                <Users className="w-5 h-5" />
                <span>Candidates ({formData.candidates.length})</span>
              </CardTitle>
              <Button
                type="button"
                onClick={addCandidate}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-400 hover:bg-slate-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.candidates.map((candidate, index) => (
              <div key={index} className="p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-white">
                    Candidate {index + 1}
                  </h4>
                  {formData.candidates.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Name *</Label>
                    <Input
                      value={candidate.name}
                      onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                      placeholder="e.g., John Smith"
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Party *</Label>
                    <Input
                      value={candidate.party}
                      onChange={(e) => handleCandidateChange(index, 'party', e.target.value)}
                      placeholder="e.g., Democratic Party"
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                    <Label className="text-slate-300">Biography</Label>
                    <Textarea
                      value={candidate.bio}
                      onChange={(e) => handleCandidateChange(index, 'bio', e.target.value)}
                      placeholder="Brief biography and qualifications..."
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                    />
                  </div>

                <div className="mt-4 space-y-2">
                  <Label className="text-slate-300">Key Policies</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {candidate.policies.map((policy, policyIndex) => (
                      <Badge
                        key={policyIndex}
                        variant="secondary"
                        className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                      >
                        {policy}
                        <button
                          type="button"
                          onClick={() => removePolicy(index, policyIndex)}
                          className="ml-1 text-blue-300 hover:text-red-400"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a policy..."
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          addPolicy(index, target.value);
                          target.value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        const input = (e.target as HTMLButtonElement).parentElement?.querySelector('input');
                        if (input) {
                          addPolicy(index, input.value);
                          input.value = '';
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-400 hover:bg-slate-700"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => navigate('/')}
            variant="outline"
            className="border-slate-600 text-slate-400 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreating || !wallet.connected}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
            size="lg"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deploying Contract...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Create Election
              </>
            )}
          </Button>
        </div>

        {!wallet.connected && (
          <div className="text-center p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
            <p className="text-yellow-400">
              Connect your wallet to create an election and deploy the smart contract
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateElectionPage;