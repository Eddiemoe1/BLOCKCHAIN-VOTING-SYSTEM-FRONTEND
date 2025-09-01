import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockWalletData, WalletData } from '../MockData';

// Define the context type
interface WalletContextType {
  wallet: WalletData;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (networkName: string) => Promise<void>;
}

// Create context with a default value (will be overridden by Provider)
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Custom hook to use the wallet context
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Define props for the WalletProvider component
interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletData>(mockWalletData);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const connectWallet = async (): Promise<void> => {
    setIsConnecting(true);
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful connection
    setWallet({
      ...wallet,
      connected: true,
      address: "0x742d35Cc6532C58d64d7A5e37C74A16a",
      balance: "2.45"
    });
    
    setIsConnecting(false);
  };

  const disconnectWallet = (): void => {
    setWallet({
      ...wallet,
      connected: false
    });
  };

  const switchNetwork = async (networkName: string): Promise<void> => {
    // Mock network switching
    await new Promise(resolve => setTimeout(resolve, 1000));
    setWallet({
      ...wallet,
      network: networkName
    });
  };

  const value: WalletContextType = {
    wallet,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchNetwork
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};