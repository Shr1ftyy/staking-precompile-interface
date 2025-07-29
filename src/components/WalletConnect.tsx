import React, { useState } from 'react';
import { Wallet, ExternalLink } from 'lucide-react';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  isConnected: boolean;
  address: string | null;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  isConnected,
  address
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this application');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        onConnect(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3 bg-green-50 dark:bg-green-900 border border-green-500 rounded-lg px-4 py-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm text-green-800 dark:text-green-100 font-medium">Connected</span>
        <span className="font-mono text-sm text-green-700 dark:text-green-200">{formatAddress(address)}</span>
        <ExternalLink 
          size={14} 
          className="text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100 cursor-pointer"
          onClick={() => window.open(`https://evm.taostats.io/address/${address}`, '_blank')}
        />
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="btn-primary flex items-center space-x-2"
    >
      {isConnecting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 dark:border-gray-600"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet size={16} />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
};
