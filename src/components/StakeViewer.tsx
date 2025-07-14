import React, { useState } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { h160ToPubKey, ss58ToPubKey, validateH160, validateSs58 } from '../utils/addressUtils';

interface StakeViewerProps {
  onGetStake: (hotkey: string, coldkey: string, netuid: number) => Promise<string>;
  walletAddress: string | null;
}

export const StakeViewer: React.FC<StakeViewerProps> = ({ onGetStake, walletAddress }) => {
  const [hotkey, setHotkey] = useState('');
  const [netuid, setNetuid] = useState('');
  const [stakeAmount, setStakeAmount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hotkey || !netuid) {
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
      const trimmedHotkey = hotkey.trim();
      const trimmedColdkey = walletAddress.trim();

      // Convert SS58 hotkey to pubkey
      try {
        validateSs58(trimmedHotkey);
        hotkeyPubKey = ss58ToPubKey(trimmedHotkey);
        console.log(`Converted hotkey ${trimmedHotkey} to pubkey ${hotkeyPubKey}`);
      } catch (err) {
        throw new Error('Invalid SS58 hotkey format. Please provide a valid SS58 address starting with "5".');
      }

      // Convert H160 coldkey (wallet address) to pubkey
      try {
        validateH160(trimmedColdkey);
        coldkeyPubKey = h160ToPubKey(trimmedColdkey);
        console.log(`Converted coldkey ${trimmedColdkey} to pubkey ${coldkeyPubKey}`);
      } catch (err) {
        throw new Error('Invalid wallet address format. Please ensure your wallet is properly connected.');
      }

      const amount = await onGetStake(hotkeyPubKey, coldkeyPubKey, parseInt(netuid));
      setStakeAmount(amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get stake');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
      <div className="flex items-center mb-6">
        <Eye className="mr-3 text-blue-400" size={24} />
        <h2 className="text-xl font-semibold text-white">View Stake</h2>
      </div>

      <form onSubmit={handleGetStake} className="space-y-4">
        <div>
          <label htmlFor="hotkey" className="block text-sm font-medium text-gray-300 mb-1">
            Hotkey (SS58 format)
          </label>
          <input
            type="text"
            id="hotkey"
            value={hotkey}
            onChange={(e) => setHotkey(e.target.value)}
            placeholder="Enter SS58 hotkey address (starts with 5...)"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="connected-wallet" className="block text-sm font-medium text-gray-300 mb-1">
            Coldkey (Your Connected Wallet)
          </label>
          <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
            <span className="font-mono text-sm text-gray-200 break-all">
              {walletAddress || 'No wallet connected'}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="netuid" className="block text-sm font-medium text-gray-300 mb-1">
            Network UID
          </label>
          <input
            type="number"
            id="netuid"
            value={netuid}
            onChange={(e) => setNetuid(e.target.value)}
            placeholder="Enter network UID"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
            min="0"
          />
        </div>

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
        <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg">
          <p className="text-sm text-red-100">{error}</p>
        </div>
      )}

      {stakeAmount !== null && (
        <div className="mt-4 p-4 bg-green-900 border border-green-700 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-100 mb-2">Stake Amount</h3>
            <p className="text-2xl font-bold text-green-200">{stakeAmount} SN{netuid} Tokens</p>
            <p className="text-sm text-green-300 mt-1">
              Staked from {walletAddress?.slice(0, 10)}... to {hotkey.slice(0, 10)}... on network {netuid}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-900 border border-blue-700 rounded-lg">
        <p className="text-sm text-blue-100">
          <strong>ℹ️ Address Formats:</strong><br />
          • Hotkey: SS58 format (starts with "5", 48 characters)<br />
          • Coldkey: Automatically set to your connected wallet address (H160 format)<br />
          Addresses are automatically converted to the required format for the smart contract.
        </p>
      </div>
    </div>
  );
};
