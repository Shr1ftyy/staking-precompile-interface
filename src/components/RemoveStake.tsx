import React, { useState, useEffect } from 'react';
import { Minus, Loader2, Trash2 } from 'lucide-react';
import type { RemoveStakeParams } from '../types';
import { ss58ToPubKey, validateSs58 } from '../utils/addressUtils';
import { useViewMode } from '../contexts/ViewModeContext';

interface RemoveStakeProps {
  onRemoveStake: (params: RemoveStakeParams) => Promise<void>;
  onRemoveStakeFull: (hotkey: string, netuid: number) => Promise<void>;
}

export const RemoveStake: React.FC<RemoveStakeProps> = ({
  onRemoveStake,
  onRemoveStakeFull
}) => {
  const { viewMode, defaultNetuid, defaultHotkey } = useViewMode();
  const [hotkey, setHotkey] = useState('');
  const [amount, setAmount] = useState('');
  const [netuid, setNetuid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFull, setIsLoadingFull] = useState(false);
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

  const handleRemoveStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentHotkey = viewMode === 'simple' ? defaultHotkey : hotkey;
    const currentNetuid = viewMode === 'simple' ? defaultNetuid.toString() : netuid;
    
    if (!currentHotkey || !amount || !currentNetuid) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert SS58 hotkey to pubkey
      const trimmedHotkey = currentHotkey.trim();
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
        netuid: parseInt(currentNetuid)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove stake');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStakeFull = async () => {
    const currentHotkey = viewMode === 'simple' ? defaultHotkey : hotkey;
    const currentNetuid = viewMode === 'simple' ? defaultNetuid.toString() : netuid;
    
    if (!currentHotkey || !currentNetuid) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoadingFull(true);
    setError(null);

    try {
      // Convert SS58 hotkey to pubkey
      const trimmedHotkey = currentHotkey.trim();
      let hotkeyPubKey: string;

      try {
        validateSs58(trimmedHotkey);
        hotkeyPubKey = ss58ToPubKey(trimmedHotkey);
      } catch {
        throw new Error('Invalid SS58 hotkey format. Please provide a valid SS58 address starting with "5".');
      }

      await onRemoveStakeFull(hotkeyPubKey, parseInt(currentNetuid));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove full stake');
    } finally {
      setIsLoadingFull(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <Minus className="mr-3 text-black dark:text-white" size={24} />
        <h2 className="text-xl font-semibold text-black dark:text-white">Remove Stake</h2>
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

      <form onSubmit={handleRemoveStake} className="space-y-4">
        {viewMode === 'advanced' && (
          <div>
            <label htmlFor="remove-hotkey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hotkey (SS58 format)
            </label>
            <input
              type="text"
              id="remove-hotkey"
              value={hotkey}
              onChange={(e) => setHotkey(e.target.value)}
              placeholder="Enter SS58 hotkey address (starts with 5...)"
              className="input-field"
            />
          </div>
        )}

        <div>
          <label htmlFor="remove-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="remove-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to remove"
            className="input-field"
            step="0.000001"
            min="0"
          />
        </div>

        {viewMode === 'advanced' && (
          <div>
            <label htmlFor="remove-netuid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subnet UID
            </label>
            <input
              type="number"
              id="remove-netuid"
              value={netuid}
              onChange={(e) => setNetuid(e.target.value)}
              placeholder="Enter subnet UID"
              className="input-field"
              min="0"
            />
          </div>
        )}

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
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-500 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-100">{error}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-500 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-100">
          <strong>⚠️ Warning:</strong> Removing stake will initiate a withdrawal process. 
          "Remove Full" will remove all staked tokens for this hotkey and subnet.
        </p>
      </div>
    </div>
  );
};
