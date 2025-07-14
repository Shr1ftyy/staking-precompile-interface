import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';

interface ContractConfigProps {
  contractAddress: string;
  onAddressChange: (address: string) => void;
}

export const ContractConfig: React.FC<ContractConfigProps> = ({
  contractAddress,
  onAddressChange
}) => {
  const [tempAddress, setTempAddress] = useState(contractAddress);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onAddressChange(tempAddress);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempAddress(contractAddress);
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <Settings className="mr-3 text-gray-600" size={20} />
        <h3 className="text-lg font-medium text-gray-900">Contract Configuration</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="contract-address" className="block text-sm font-medium text-gray-700 mb-1">
            Contract Address
          </label>
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                id="contract-address"
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                placeholder="Enter contract address (0x...)"
                className="input-field"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="btn-primary"
                  disabled={!tempAddress || tempAddress === contractAddress}
                >
                  <Save className="mr-2" size={16} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-mono text-sm text-gray-800 break-all">
                {contractAddress || 'No contract address set'}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="ml-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        
        {!contractAddress && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Warning:</strong> Please set a valid contract address before interacting with the staking contract.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
