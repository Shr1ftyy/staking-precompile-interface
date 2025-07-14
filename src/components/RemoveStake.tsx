import React, { useState } from 'react';
import { Minus, Loader2, Trash2 } from 'lucide-react';
import type { RemoveStakeParams } from '../types';
import { ss58ToPubKey, validateSs58 } from '../utils/addressUtils';

interface RemoveStakeProps {
  onRemoveStake: (params: RemoveStakeParams) => Promise<void>;
  onRemoveStakeFull: (hotkey: string, netuid: number) => Promise<void>;
}

export const RemoveStake: React.FC<RemoveStakeProps> = ({
  onRemoveStake,
  onRemoveStakeFull
}) => {
  const [hotkey, setHotkey] = useState('');
  const [amount, setAmount] = useState('');
  const [netuid, setNetuid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFull, setIsLoadingFull] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemoveStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hotkey || !amount || !netuid) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert SS58 hotkey to pubkey
      const trimmedHotkey = hotkey.trim();
      let hotkeyPubKey: string;

      try {
        validateSs58(trimmedHotkey);
        hotkeyPubKey = ss58ToPubKey(trimmedHotkey);
      } catch {
        throw new Error('Invalid SS58 hotkey format. Please provide a valid SS58 address starting with "5".');
      }

      await onRemoveStake({
        hotkey: hotkeyPubKey,
        amount,
        netuid: parseInt(netuid)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove stake');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStakeFull = async () => {
    if (!hotkey || !netuid) {
      setError('Please enter hotkey and subnet UID');
      return;
    }

    setIsLoadingFull(true);
    setError(null);

    try {
      // Convert SS58 hotkey to pubkey
      const trimmedHotkey = hotkey.trim();
      let hotkeyPubKey: string;

      try {
        validateSs58(trimmedHotkey);
        hotkeyPubKey = ss58ToPubKey(trimmedHotkey);
      } catch {
        throw new Error('Invalid SS58 hotkey format. Please provide a valid SS58 address starting with "5".');
      }

      await onRemoveStakeFull(hotkeyPubKey, parseInt(netuid));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove full stake');
    } finally {
      setIsLoadingFull(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
      <div className="flex items-center mb-6">
        <Minus className="mr-3 text-blue-400" size={24} />
        <h2 className="text-xl font-semibold text-white">Remove Stake</h2>
      </div>

      <form onSubmit={handleRemoveStake} className="space-y-4">
        <div>
          <label htmlFor="remove-hotkey" className="block text-sm font-medium text-gray-300 mb-1">
            Hotkey (SS58 format)
          </label>
          <input
            type="text"
            id="remove-hotkey"
            value={hotkey}
            onChange={(e) => setHotkey(e.target.value)}
            placeholder="Enter SS58 hotkey address (starts with 5...)"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="remove-amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount (ETH)
          </label>
          <input
            type="number"
            id="remove-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to remove"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
            step="0.000001"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="remove-netuid" className="block text-sm font-medium text-gray-300 mb-1">
            Subnet UID
          </label>
          <input
            type="number"
            id="remove-netuid"
            value={netuid}
            onChange={(e) => setNetuid(e.target.value)}
            placeholder="Enter subnet UID"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
            min="0"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading || isLoadingFull}
            className="btn-secondary flex-1"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Removing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Minus className="mr-2" size={16} />
                Remove Partial
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={handleRemoveStakeFull}
            disabled={isLoading || isLoadingFull}
            className="btn-danger flex-1"
          >
            {isLoadingFull ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                Removing All...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Trash2 className="mr-2" size={16} />
                Remove Full
              </div>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg">
          <p className="text-sm text-red-100">{error}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
        <p className="text-sm text-yellow-100">
          <strong>⚠️ Warning:</strong> Removing stake will initiate a withdrawal process. 
          "Remove Full" will remove all staked tokens for this hotkey and subnet.
        </p>
      </div>
    </div>
  );
};
