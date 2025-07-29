import { ethers } from 'ethers';
import { STAKING_CONTRACT_ABI } from '../contracts/abi';
import type { 
  TransactionResult, 
  RemoveStakeParams, 
  TransferStakeParams
} from '../types';
import {
  stringToBytes32,
  formatRao,
  parseToRao
} from '../types';

// Extend Window interface for ethereum
interface EthereumProvider extends ethers.Eip1193Provider {
  on(event: string, listener: (...args: any[]) => void): void;
  removeListener(event: string, listener: (...args: any[]) => void): void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// Constant contract address
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000805';

export class StakingService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    // Contract address is now constant
  }

  async connect(): Promise<boolean> {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      await this.provider.send('eth_requestAccounts', []);
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        STAKING_CONTRACT_ABI,
        this.signer
      );

      return true;
    } catch (error) {
      console.error('Failed to connect:', error);
      return false;
    }
  }

  async getStake(hotkey: string, coldkey: string, netuid: number): Promise<string> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const hotkeyBytes32 = stringToBytes32(hotkey);
      const coldkeyBytes32 = stringToBytes32(coldkey);
      
      const result = await this.contract.getStake(hotkeyBytes32, coldkeyBytes32, netuid);
      return formatRao(result.toString());
    } catch (error) {
      console.error('Failed to get stake:', error);
      throw error;
    }
  }

  async removeStake(params: RemoveStakeParams): Promise<TransactionResult> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const hotkeyBytes32 = stringToBytes32(params.hotkey);
      const amountRao = parseToRao(params.amount);

      const tx = await this.contract.removeStake(
        hotkeyBytes32,
        amountRao,
        params.netuid
      );

      return {
        hash: tx.hash,
        status: 'pending'
      };
    } catch (error) {
      console.error('Failed to remove stake:', error);
      return {
        hash: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async removeStakeFull(hotkey: string, netuid: number): Promise<TransactionResult> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const hotkeyBytes32 = stringToBytes32(hotkey);

      const tx = await this.contract.removeStakeFull(hotkeyBytes32, netuid);

      return {
        hash: tx.hash,
        status: 'pending'
      };
    } catch (error) {
      console.error('Failed to remove full stake:', error);
      return {
        hash: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async transferStake(params: TransferStakeParams): Promise<TransactionResult> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const destinationColdkeyBytes32 = stringToBytes32(params.destinationColdkey);
      const hotkeyBytes32 = stringToBytes32(params.hotkey);
      const amountRao = parseToRao(params.amount);

      const tx = await this.contract.transferStake(
        destinationColdkeyBytes32,
        hotkeyBytes32,
        params.originNetuid,
        params.destinationNetuid,
        amountRao
      );

      return {
        hash: tx.hash,
        status: 'pending'
      };
    } catch (error) {
      console.error('Failed to transfer stake:', error);
      return {
        hash: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async waitForTransaction(txHash: string): Promise<TransactionResult> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const receipt = await this.provider.waitForTransaction(txHash);
      
      if (receipt && receipt.status === 1) {
        return {
          hash: txHash,
          status: 'success'
        };
      } else {
        return {
          hash: txHash,
          status: 'failed',
          error: 'Transaction failed'
        };
      }
    } catch (error) {
      return {
        hash: txHash,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getWalletAddress(): Promise<string | null> {
    try {
      if (!this.signer) {
        return null;
      }
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Failed to get wallet address:', error);
      return null;
    }
  }

  getContractAddress(): string {
    return CONTRACT_ADDRESS;
  }
}
