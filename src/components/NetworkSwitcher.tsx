import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { isOnBittensorNetwork, switchToBittensorNetwork, getCurrentNetworkName } from '../utils/networkUtils';

interface NetworkSwitcherProps {
  children: React.ReactNode;
  title: string;
}

export const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({ 
  children,
  title
}) => {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('Unknown');
  const [isChecking, setIsChecking] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    checkNetwork();
    
    // Listen for network changes
    if (window.ethereum) {
      const handleChainChanged = () => {
        checkNetwork();
      };
      
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkNetwork = async () => {
    setIsChecking(true);
    try {
      const [isCorrect, networkName] = await Promise.all([
        isOnBittensorNetwork(),
        getCurrentNetworkName()
      ]);
      setIsCorrectNetwork(isCorrect);
      setCurrentNetwork(networkName);
    } catch (error) {
      console.error('Failed to check network:', error);
      setIsCorrectNetwork(false);
      setCurrentNetwork('Unknown');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      await switchToBittensorNetwork();
      // Network check will happen automatically via the chainChanged event
    } catch (error) {
      console.error('Failed to switch network:', error);
      alert(error instanceof Error ? error.message : 'Failed to switch network');
    } finally {
      setIsSwitching(false);
    }
  };

  if (isChecking) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <RefreshCw className="mx-auto h-8 w-8 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Checking network...</p>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-xl font-medium text-black dark:text-white mb-2">
            Wrong Network
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            You're currently connected to: <span className="font-medium">{currentNetwork}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Switch to <span className="font-medium">Bittensor</span> network to use {title.toLowerCase()}.
          </p>
          
          <button
            onClick={handleSwitchNetwork}
            disabled={isSwitching}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            {isSwitching ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                <span>Switching...</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>Switch to Bittensor</span>
              </>
            )}
          </button>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Bittensor Network Details
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p><span className="font-medium">Chain ID:</span> 964</p>
              <p><span className="font-medium">Currency:</span> TAO</p>
              <p><span className="font-medium">RPC:</span> https://lite.chain.opentensor.ai</p>
              <p><span className="font-medium">Explorer:</span> https://evm.taostats.io</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card">
        {children}
      </div>
    </div>
  );
};
