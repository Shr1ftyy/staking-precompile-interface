# Staking Contract Frontend

An interface for interacting with the staking precompile on the Bittensor network

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Access to an EVM-compatible blockchain

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Configuration

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask wallet
2. **Set Contract Address**: Enter your staking contract address in the configuration panel
3. **Start Interacting**: Use the tabs to view stakes, remove stakes, or transfer stakes

## Smart Contract Interface

The frontend interacts with these contract functions:

### View Functions
- `getStake(hotkey, coldkey, netuid)` - Returns the stake amount for given parameters

### Transaction Functions
- `removeStake(hotkey, amount, netuid)` - Remove a specific amount of stake
- `removeStakeFull(hotkey, netuid)` - Remove all stake for a hotkey/netuid pair
- `transferStake(destinationColdkey, hotkey, originNetuid, destinationNetuid, amount)` - Transfer stake between coldkeys

## Usage Guide

### Viewing Stakes

1. Navigate to the "View Stake" tab
2. Enter the hotkey address/identifier
3. Enter the coldkey address/identifier  
4. Enter the network UID
5. Click "Get Stake" to view the staked amount

### Removing Stakes

1. Navigate to the "Remove Stake" tab
2. Enter the hotkey and network UID
3. For partial removal: Enter the amount and click "Remove Partial"
4. For full removal: Click "Remove Full" to remove all staked tokens

### Transferring Stakes

1. Navigate to the "Transfer Stake" tab
2. Enter the destination coldkey address
3. Enter the hotkey address
4. Specify origin and destination network UIDs
5. Enter the amount to transfer
6. Click "Transfer Stake"

## Development

### Project Structure

```
src/
├── components/           # React components
│   ├── WalletConnect.tsx    # Wallet connection interface
│   ├── StakeViewer.tsx      # Stake viewing component
│   ├── RemoveStake.tsx      # Stake removal interface
│   ├── TransferStake.tsx    # Stake transfer interface
│   └── ContractConfig.tsx   # Contract configuration
├── contracts/           # Smart contract interfaces
│   └── abi.ts              # Contract ABI definition
├── services/           # Business logic
│   └── stakingService.ts   # Web3 interaction service
├── types/              # TypeScript type definitions
│   └── index.ts           # Shared interfaces and utilities
└── App.tsx             # Main application component
```