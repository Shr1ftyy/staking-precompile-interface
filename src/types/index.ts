export interface StakeInfo {
  hotkey: string;
  coldkey: string;
  netuid: number;
  amount: string;
}

export interface TransactionResult {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  error?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
}

export interface RemoveStakeParams {
  hotkey: string;
  amount: string;
  netuid: number;
}

export interface TransferStakeParams {
  destinationColdkey: string;
  hotkey: string;
  originNetuid: number;
  destinationNetuid: number;
  amount: string;
}

// Utility function to convert strings to bytes32 (fallback for non-address strings)
export const stringToBytes32 = (str: string): string => {
  // If it's already a valid hex string, return it
  if (str.startsWith('0x') && str.length === 66) {
    return str;
  }
  
  // Convert string to bytes32
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  
  // Pad to 32 bytes
  const bytes32 = new Uint8Array(32);
  bytes32.set(data.slice(0, 32));
  
  return '0x' + Array.from(bytes32)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Utility function to format wei to readable amount
export const formatRao = (raoAmount: string): string => {
  try {
    const rao = BigInt(raoAmount);
    const eth = Number(rao) / 1e9;
    return eth.toFixed(6);
  } catch {
    return '0';
  }
};

// Utility function to parse readable amount to rao
export const parseToRao = (amount: string): string => {
  try {
    const eth = parseFloat(amount);
    const rao = BigInt(Math.floor(eth * 1e9));
    return rao.toString();
  } catch {
    return '0';
  }
};
