import { useState, useEffect } from 'react';
import { Coins, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { WalletConnect } from './components/WalletConnect';
import { StakeViewer } from './components/StakeViewer';
import { RemoveStake } from './components/RemoveStake';
import { TransferStake } from './components/TransferStake';
import { ThemeToggle } from './components/ThemeToggle';
import { ViewModeToggle } from './components/ViewModeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { ViewModeProvider } from './contexts/ViewModeContext';
import { StakingService } from './services/stakingService';
import type { RemoveStakeParams, TransferStakeParams } from './types';

function App() {
  const [stakingService] = useState(() => new StakingService());
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'view' | 'remove' | 'transfer'>('view');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    txHash?: string;
  } | null>(null);

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await stakingService.connect();
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setWalletAddress(null);
    } else {
      setWalletAddress(accounts[0]);
    }
  };

  const handleWalletConnect = async (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    
    const connected = await stakingService.connect();
    if (!connected) {
      showNotification('error', 'Failed to initialize staking service');
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string, txHash?: string) => {
    setNotification({ type, message, txHash });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleGetStake = async (hotkey: string, coldkey: string, netuid: number): Promise<string> => {
    try {
      const stake = await stakingService.getStake(hotkey, coldkey, netuid);
      return stake;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get stake';
      showNotification('error', message);
      throw error;
    }
  };

  const handleRemoveStake = async (params: RemoveStakeParams) => {
    try {
      const result = await stakingService.removeStake(params);
      
      if (result.status === 'failed') {
        showNotification('error', result.error || 'Transaction failed');
        return;
      }

      showNotification('info', 'Transaction submitted. Waiting for confirmation...', result.hash);
      
      // Wait for transaction confirmation
      const finalResult = await stakingService.waitForTransaction(result.hash);
      
      if (finalResult.status === 'success') {
        showNotification('success', 'Stake removed successfully!', finalResult.hash);
      } else {
        showNotification('error', finalResult.error || 'Transaction failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove stake';
      showNotification('error', message);
    }
  };

  const handleRemoveStakeFull = async (hotkey: string, netuid: number) => {
    try {
      const result = await stakingService.removeStakeFull(hotkey, netuid);
      
      if (result.status === 'failed') {
        showNotification('error', result.error || 'Transaction failed');
        return;
      }

      showNotification('info', 'Transaction submitted. Waiting for confirmation...', result.hash);
      
      // Wait for transaction confirmation
      const finalResult = await stakingService.waitForTransaction(result.hash);
      
      if (finalResult.status === 'success') {
        showNotification('success', 'Full stake removed successfully!', finalResult.hash);
      } else {
        showNotification('error', finalResult.error || 'Transaction failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove full stake';
      showNotification('error', message);
    }
  };

  const handleTransferStake = async (params: TransferStakeParams) => {
    try {
      const result = await stakingService.transferStake(params);
      
      if (result.status === 'failed') {
        showNotification('error', result.error || 'Transaction failed');
        return;
      }

      showNotification('info', 'Transaction submitted. Waiting for confirmation...', result.hash);
      
      // Wait for transaction confirmation
      const finalResult = await stakingService.waitForTransaction(result.hash);
      
      if (finalResult.status === 'success') {
        showNotification('success', 'Stake transferred successfully!', finalResult.hash);
      } else {
        showNotification('error', finalResult.error || 'Transaction failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to transfer stake';
      showNotification('error', message);
    }
  };

  const tabs = [
    { id: 'view' as const, label: 'View Stake', icon: '👁️' },
    { id: 'remove' as const, label: 'Remove Stake', icon: '➖' },
    { id: 'transfer' as const, label: 'Transfer Stake', icon: '🔄' },
  ];

  return (
    <ThemeProvider>
      <ViewModeProvider>
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Coins className="text-black dark:text-white mr-3" size={40} />
                <div>
                  <h1 className="text-3xl font-bold text-black dark:text-white">Bittensor EVM Staking Interface</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Stake, remove, and transfer your alpha tokens on Bittensor
                  </p>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-4">
                <ViewModeToggle />
                <ThemeToggle />
                <WalletConnect
                  onConnect={handleWalletConnect}
                  isConnected={isConnected}
                  address={walletAddress}
                />
              </div>
            </div>

          {/* Notifications */}
          {notification && (
            <div className={`notification ${notification.type}`}>
              <div className="flex items-start">
                {notification.type === 'success' && <CheckCircle className="mr-3 mt-0.5" size={20} />}
                {notification.type === 'error' && <AlertCircle className="mr-3 mt-0.5" size={20} />}
                {notification.type === 'info' && <AlertCircle className="mr-3 mt-0.5" size={20} />}
                <div className="flex-1">
                  <p className="font-medium">{notification.message}</p>
                  {notification.txHash && (
                    <p className="mt-1 flex items-center">
                      <span className="text-sm">Transaction: </span>
                      <a 
                        href={`https://etherscan.io/tx/${notification.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-mono ml-1 hover:underline flex items-center"
                      >
                        {notification.txHash.slice(0, 10)}...{notification.txHash.slice(-8)}
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {isConnected ? (
            <>
              {/* Tab Navigation */}
              <div className="card mb-6">
                <div className="flex space-x-2 bg-gray-100 dark:bg-neutral-900 p-2 rounded-lg border border-black dark:border-white">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`tab-button ${
                        activeTab === tab.id ? 'active' : 'inactive'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="animate-slide-up">
                {activeTab === 'view' && (
                  <StakeViewer 
                    onGetStake={handleGetStake} 
                    walletAddress={walletAddress}
                  />
                )}
                
                {activeTab === 'remove' && (
                  <RemoveStake
                    onRemoveStake={handleRemoveStake}
                    onRemoveStakeFull={handleRemoveStakeFull}
                  />
                )}
                
                {activeTab === 'transfer' && (
                  <TransferStake onTransferStake={handleTransferStake} />
                )}
              </div>
            </>
          ) : (
            <div className="card text-center">
              <div className="py-12">
                <Coins className="mx-auto h-16 w-16 text-black dark:text-white mb-4" />
                <h3 className="text-xl font-medium text-black dark:text-white mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Connect your wallet to begin interacting with the staking contract.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Built w/ ❤️ by <a href="https://github.com/shr1ftyy" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:underline transition-colors">shr1ftyy</a></p>
        </div>
      </div>
    </div>
      </ViewModeProvider>
    </ThemeProvider>
  );
}

export default App;
