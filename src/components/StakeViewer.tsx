import React, { useState, useEffect } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { h160ToPubKey, ss58ToPubKey, validateH160, validateSs58 } from '../utils/addressUtils';
import { useViewMode } from '../contexts/ViewModeContext';

interface StakeViewerProps {
  onGetStake: (hotkey: string, coldkey: string, netuid: number) => Promise<string>;
  walletAddress: string | null;
}

export const StakeViewer: React.FC<StakeViewerProps> = ({ onGetStake, walletAddress }) => {
  const { viewMode, defaultNetuid, defaultHotkey } = useViewMode();
  const [hotkey, setHotkey] = useState('');
  const [netuid, setNetuid] = useState('');
  const [stakeAmount, setStakeAmount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default values when in simple mode
  useEffect(() => {
    if (viewMode === 'simple') {
      setHotkey(defaultHotkey);
      setNetuid(defaultNetuid.toString());
    } else {
      // Clear values when switching to advanced mode
      setHotkey('');
      setNetuid('');
    }
  }, [viewMode, defaultHotkey, defaultNetuid]);

  const handleGetStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentHotkey = viewMode === 'simple' ? defaultHotkey : hotkey;
    const currentNetuid = viewMode === 'simple' ? defaultNetuid.toString() : netuid;
    
    if (!currentHotkey || !currentNetuid) {
      setError('Please fill in all fields');
      return;
    }

    if (!walletAddress) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStakeAmount(null);

    try {
      // Validate and convert addresses
      let hotkeyPubKey: string;
      let coldkeyPubKey: string;

      // Trim inputs to handle whitespace
      const trimmedHotkey = currentHotkey.trim();
      const trimmedColdkey = walletAddress.trim();

      // Convert SS58 hotkey to pubkey
      try {
        validateSs58(trimmedHotkey);
        hotkeyPubKey = ss58ToPubKey(trimmedHotkey);
        console.log(`Converted hotkey ${trimmedHotkey} to pubkey ${hotkeyPubKey}`);
      } catch {
        throw new Error('Invalid SS58 hotkey format. Please provide a valid SS58 address starting with "5".');
      }

      // Convert H160 coldkey (wallet address) to pubkey
      try {
        validateH160(trimmedColdkey);
        coldkeyPubKey = h160ToPubKey(trimmedColdkey);
        console.log(`Converted coldkey ${trimmedColdkey} to pubkey ${coldkeyPubKey}`);
      } catch {
        throw new Error('Invalid wallet address format. Please ensure your wallet is properly connected.');
      }

      const amount = await onGetStake(hotkeyPubKey, coldkeyPubKey, parseInt(currentNetuid));
      setStakeAmount(amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get stake');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <Eye className="mr-3 text-black dark:text-white" size={24} />
        <h2 className="text-xl font-semibold text-black dark:text-white">View Stake</h2>
        {viewMode === 'simple' && (
          <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium">
            Simple Mode
          </span>
        )}
      </div>

      {viewMode === 'simple' && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Simple mode: Using default hotkey <span className="font-mono">{defaultHotkey.slice(0, 10)}...</span> on subnet {defaultNetuid}
          </p>
        </div>
      )}

      <form onSubmit={handleGetStake} className="space-y-4">
        {viewMode === 'advanced' && (
          <div>
            <label htmlFor="hotkey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hotkey (SS58 format)
            </label>
            <input
              type="text"
              id="hotkey"
              value={hotkey}
              onChange={(e) => setHotkey(e.target.value)}
              placeholder="Enter SS58 hotkey address (starts with 5...)"
              className="input-field"
            />
          </div>
        )}

        <div>
          <label htmlFor="connected-wallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Coldkey (Your Connected Wallet)
          </label>
          <div className="p-3 bg-gray-100 dark:bg-neutral-900 rounded-lg border border-black dark:border-gray-600">
            <span className="font-mono text-sm text-black dark:text-white break-all">
              {walletAddress || 'No wallet connected'}
            </span>
          </div>
        </div>

        {viewMode === 'advanced' && (
          <div>
            <label htmlFor="netuid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subnet UID
            </label>
            <input
              type="number"
              id="netuid"
              value={netuid}
              onChange={(e) => setNetuid(e.target.value)}
              placeholder="Enter subnet UID"
              className="input-field"
              min="0"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" size={16} />
              Getting Stake...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Eye className="mr-2" size={16} />
              Get Stake
            </div>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-500 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-100">{error}</p>
        </div>
      )}

      {stakeAmount !== null && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 border border-green-500 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-100 mb-2">Stake Amount</h3>
            <p className="text-2xl font-bold text-green-900 dark:text-green-200">
              {stakeAmount} SN{viewMode === 'simple' ? defaultNetuid : netuid} Tokens
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Staked from {walletAddress?.slice(0, 10)}... to {(viewMode === 'simple' ? defaultHotkey : hotkey).slice(0, 10)}... on subnet {viewMode === 'simple' ? defaultNetuid : netuid}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
