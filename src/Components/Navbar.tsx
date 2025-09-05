import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useWallet } from '../Contexts/WalletContext';
import { 
  Wallet,
  Vote,
  BarChart3,
  PlusCircle,
  History,
  Shield,
  Menu,
  X,
  type LucideIcon
} from 'lucide-react';
import { useState } from 'react';
import './navbar.css';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const { wallet, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navigation: NavigationItem[] = [
    { name: 'Elections', href: '/', icon: Vote },
    { name: 'Create Election', href: '/create', icon: PlusCircle },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Vote History', href: '/history', icon: History },
    { name: 'Verification', href: '/verification', icon: Shield }
  ];

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <span className="logo-text">BlockVote</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection */}
          <div className="wallet-section">
            {wallet.connected ? (
              <>
                <div className="wallet-info">
                  <div className="wallet-address">
                    {formatAddress(wallet.address)}
                  </div>
                  <div className="wallet-balance">
                    {wallet.balance} ETH
                  </div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="nav-button outline small"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="nav-button primary small"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="mobile-nav">
            <div className="mobile-nav-inner">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-nav-item ${isActive(item.href) ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;