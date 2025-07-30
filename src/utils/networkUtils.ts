// Bittensor EVM Network Configuration
export const BITTENSOR_NETWORK = {
  chainId: '0x3C4', // 964 in hex
  chainName: 'Bittensor',
  nativeCurrency: {
    name: 'TAO',
    symbol: 'TAO',
    decimals: 18,
  },
  rpcUrls: ['https://lite.chain.opentensor.ai'],
  blockExplorerUrls: ['https://evm.taostats.io'],
} as const;

export const BITTENSOR_CHAIN_ID = 964;

/**
 * Check if the current network is Bittensor EVM
 */
export async function isOnBittensorNetwork(): Promise<boolean> {
  if (!window.ethereum) {
    return false;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16) === BITTENSOR_CHAIN_ID;
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    return false;
  }
}

/**
 * Switch to Bittensor EVM network
 */
export async function switchToBittensorNetwork(): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BITTENSOR_NETWORK.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        // Add the network to MetaMask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [BITTENSOR_NETWORK],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Bittensor network:', addError);
        throw new Error('Failed to add Bittensor network to wallet');
      }
    } else {
      console.error('Failed to switch to Bittensor network:', switchError);
      throw new Error('Failed to switch to Bittensor network');
    }
  }
}

/**
 * Get the current network name
 */
export async function getCurrentNetworkName(): Promise<string> {
  if (!window.ethereum) {
    return 'Unknown';
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const numericChainId = parseInt(chainId, 16);
    
    switch (numericChainId) {
      case BITTENSOR_CHAIN_ID:
        return 'Bittensor';
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 137:
        return 'Polygon';
      case 56:
        return 'BSC';
      default:
        return `Unknown (${numericChainId})`;
    }
  } catch (error) {
    console.error('Failed to get network name:', error);
    return 'Unknown';
  }
}
