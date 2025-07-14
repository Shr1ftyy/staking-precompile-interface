import React, { useState } from 'react';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import type { TransferStakeParams } from '../types';
import { ss58ToPubKey, validateSs58 } from '../utils/addressUtils';

interface TransferStakeProps {
  onTransferStake: (params: TransferStakeParams) => Promise<void>;
}

export const TransferStake: React.FC<TransferStakeProps> = ({ onTransferStake }) => {
  const [destinationColdkey, setDestinationColdkey] = useState('');
  const [hotkey, setHotkey] = useState('');
  const [originNetuid, setOriginNetuid] = useState('');
  const [destinationNetuid, setDestinationNetuid] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransferStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destinationColdkey || !hotkey || !originNetuid || !destinationNetuid || !amount) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert SS58 addresses to pubkeys
      const trimmedDestinationColdkey = destinationColdkey.trim();
      const trimmedHotkey = hotkey.trim();
      let destinationColdkeyPubKey: string;
      let hotkeyPubKey: string;

      // Convert destination coldkey SS58 to pubkey
      try {
        validateSs58(trimmedDestinationColdkey);
        destinationColdkeyPubKey = ss58ToPubKey(trimmedDestinationColdkey);
      } catch (err) {
        throw new Error('Invalid SS58 destination coldkey format. Please provide a valid SS58 address starting with "5".');
      }

      // Convert hotkey SS58 to pubkey
      try {
        validateSs58(trimmedHotkey);
        hotkeyPubKey = ss58ToPubKey(trimmedHotkey);
      } catch (err) {
        throw new Error('Invalid SS58 hotkey format. Please provide a valid SS58 address starting with "5".');
      }

      await onTransferStake({
        destinationColdkey: destinationColdkeyPubKey,
        hotkey: hotkeyPubKey,
        originNetuid: parseInt(originNetuid),
        destinationNetuid: parseInt(destinationNetuid),
        amount
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer stake');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
      <div className="flex items-center mb-6">
        <ArrowRightLeft className="mr-3 text-blue-400" size={24} />
        <h2 className="text-xl font-semibold text-white">Transfer Stake</h2>
      </div>

      <form onSubmit={handleTransferStake} className="space-y-4">
        <div>
          <label htmlFor="destination-coldkey" className="block text-sm font-medium text-gray-300 mb-1">
            Destination Coldkey (SS58 format)
          </label>
          <input
            type="text"
            id="destination-coldkey"
            value={destinationColdkey}
            onChange={(e) => setDestinationColdkey(e.target.value)}
            placeholder="Enter SS58 destination coldkey address (starts with 5...)"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="transfer-hotkey" className="block text-sm font-medium text-gray-300 mb-1">
            Hotkey (SS58 format)
          </label>
          <input
            type="text"
            id="transfer-hotkey"
            value={hotkey}
            onChange={(e) => setHotkey(e.target.value)}
            placeholder="Enter SS58 hotkey address (starts with 5...)"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin-netuid" className="block text-sm font-medium text-gray-300 mb-1">
              Origin Network UID
            </label>
            <input
              type="number"
              id="origin-netuid"
              value={originNetuid}
              onChange={(e) => setOriginNetuid(e.target.value)}
              placeholder="From network"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="destination-netuid" className="block text-sm font-medium text-gray-300 mb-1">
              Destination Network UID
            </label>
            <input
              type="number"
              id="destination-netuid"
              value={destinationNetuid}
              onChange={(e) => setDestinationNetuid(e.target.value)}
              placeholder="To network"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              min="0"
            />
          </div>
        </div>

        <div>
          <label htmlFor="transfer-amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount (ETH)
          </label>
          <input
            type="number"
            id="transfer-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to transfer"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
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
        <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg">
          <p className="text-sm text-red-100">{error}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-900 border border-blue-700 rounded-lg">
        <p className="text-sm text-blue-100">
          <strong>ℹ️ Info:</strong> This will transfer staked tokens from one coldkey to another, 
          potentially across different networks. Use SS58 format for both destination coldkey and hotkey addresses.
        </p>
      </div>
    </div>
  );
};
