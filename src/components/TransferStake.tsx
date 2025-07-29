import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import type { TransferStakeParams } from '../types';
import { ss58ToPubKey, validateSs58 } from '../utils/addressUtils';
import { useViewMode } from '../contexts/ViewModeContext';

interface TransferStakeProps {
  onTransferStake: (params: TransferStakeParams) => Promise<void>;
}

export const TransferStake: React.FC<TransferStakeProps> = ({ onTransferStake }) => {
  const { viewMode, defaultNetuid, defaultHotkey } = useViewMode();
  const [destinationColdkey, setDestinationColdkey] = useState('');
  const [hotkey, setHotkey] = useState('');
  const [originNetuid, setOriginNetuid] = useState('');
  const [destinationNetuid, setDestinationNetuid] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default values when in simple mode
  useEffect(() => {
    if (viewMode === 'simple') {
      setHotkey(defaultHotkey);
      setOriginNetuid(defaultNetuid.toString());
      setDestinationNetuid(defaultNetuid.toString());
    } else {
      // Clear values when switching to advanced mode
      setHotkey('');
      setOriginNetuid('');
      setDestinationNetuid('');
    }
  }, [viewMode, defaultHotkey, defaultNetuid]);

  const handleTransferStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentHotkey = viewMode === 'simple' ? defaultHotkey : hotkey;
    const currentOriginNetuid = viewMode === 'simple' ? defaultNetuid.toString() : originNetuid;
    const currentDestinationNetuid = viewMode === 'simple' ? defaultNetuid.toString() : destinationNetuid;
    
    if (!destinationColdkey || !currentHotkey || !currentOriginNetuid || !currentDestinationNetuid || !amount) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert SS58 addresses to pubkeys
      const trimmedDestinationColdkey = destinationColdkey.trim();
      const trimmedHotkey = currentHotkey.trim();
      let destinationColdkeyPubKey: string;
      let hotkeyPubKey: string;

      // Convert destination coldkey SS58 to pubkey
      try {
        validateSs58(trimmedDestinationColdkey);
        destinationColdkeyPubKey = ss58ToPubKey(trimmedDestinationColdkey);
      } catch {
        throw new Error('Invalid SS58 destination coldkey format. Please provide a valid SS58 address starting with "5".');
      }

      // Convert hotkey SS58 to pubkey
      try {
        validateSs58(trimmedHotkey);
        hotkeyPubKey = ss58ToPubKey(trimmedHotkey);
      } catch {
        throw new Error('Invalid SS58 hotkey format. Please provide a valid SS58 address starting with "5".');
      }

      await onTransferStake({
        destinationColdkey: destinationColdkeyPubKey,
        hotkey: hotkeyPubKey,
        originNetuid: parseInt(currentOriginNetuid),
        destinationNetuid: parseInt(currentDestinationNetuid),
        amount
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer stake');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <ArrowRightLeft className="mr-3 text-black dark:text-white" size={24} />
        <h2 className="text-xl font-semibold text-black dark:text-white">Transfer Stake</h2>
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

      <form onSubmit={handleTransferStake} className="space-y-4">
        <div>
          <label htmlFor="destination-coldkey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Destination Coldkey (SS58 format)
          </label>
          <input
            type="text"
            id="destination-coldkey"
            value={destinationColdkey}
            onChange={(e) => setDestinationColdkey(e.target.value)}
            placeholder="Enter SS58 destination coldkey address (starts with 5...)"
            className="input-field"
          />
        </div>

        {viewMode === 'advanced' && (
          <div>
            <label htmlFor="transfer-hotkey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hotkey (SS58 format)
            </label>
            <input
              type="text"
              id="transfer-hotkey"
              value={hotkey}
              onChange={(e) => setHotkey(e.target.value)}
              placeholder="Enter SS58 hotkey address (starts with 5...)"
              className="input-field"
            />
          </div>
        )}

        {viewMode === 'advanced' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="origin-netuid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Origin Subnet UID
              </label>
              <input
                type="number"
                id="origin-netuid"
                value={originNetuid}
                onChange={(e) => setOriginNetuid(e.target.value)}
                placeholder="From subnet"
                className="input-field"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="destination-netuid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destination Subnet UID
              </label>
              <input
                type="number"
                id="destination-netuid"
                value={destinationNetuid}
                onChange={(e) => setDestinationNetuid(e.target.value)}
                placeholder="To subnet"
                className="input-field"
                min="0"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="transfer-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="transfer-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to transfer"
            className="input-field"
            step="0.000001"
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
              Transferring...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <ArrowRightLeft className="mr-2" size={16} />
              Transfer Stake
            </div>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-500 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-100">{error}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-500 rounded-lg">
        <p className="text-sm text-gray-800 dark:text-gray-100">
          <strong>ℹ️ Info:</strong> This will transfer staked tokens from one coldkey to another, 
          potentially across different subnets. Use SS58 format for both destination coldkey and hotkey addresses.
        </p>
      </div>
    </div>
  );
};
