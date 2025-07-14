# Staking Contract Frontend

A modern, responsive React TypeScript frontend for interacting with EVM-based staking smart contracts. This application provides a user-friendly interface to view stakes, remove stakes, and transfer staked tokens.

## Features

- 🔗 **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- 👁️ **Stake Viewer**: Query and display stake amounts for specific hotkey/coldkey/netuid combinations
- ➖ **Stake Removal**: Remove partial or full stakes with transaction tracking
- 🔄 **Stake Transfer**: Transfer stakes between coldkeys and networks
- ⚙️ **Contract Configuration**: Easily configure smart contract addresses
- 📱 **Responsive Design**: Modern UI that works on desktop and mobile
- 🔔 **Real-time Notifications**: Transaction status updates with blockchain explorer links

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Web3**: ethers.js
- **Icons**: Lucide React

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

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Components

- **WalletConnect**: Manages Web3 wallet connection and displays connection status
- **StakeViewer**: Provides interface to query stake amounts from the contract
- **RemoveStake**: Handles both partial and full stake removal operations
- **TransferStake**: Manages stake transfers between different coldkeys and networks
- **ContractConfig**: Allows users to configure the smart contract address

## Security Considerations

- Always verify contract addresses before interacting
- Double-check transaction parameters before submitting
- Use testnet for testing before mainnet deployment
- Keep your private keys secure and never share them

## Browser Support

- Chrome/Chromium-based browsers with MetaMask
- Firefox with MetaMask
- Brave browser
- Any browser with a compatible Web3 wallet extension

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
