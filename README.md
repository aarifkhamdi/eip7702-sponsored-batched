# EIP-7702 Sponsored Batched Transactions Demo

This project demonstrates how to use EIP-7702 to sponsor gas fees and collect funds from deposit wallets using sponsored transactions with batching support. The demo showcases a practical implementation of EIP-7702's account abstraction capabilities for efficient multi-wallet operations.

## What is EIP-7702?

EIP-7702 introduces account abstraction by allowing externally owned accounts (EOAs) to temporarily delegate their execution to smart contract code during a transaction. This enables features like:

- **Gas sponsorship**: A different account can pay for transaction gas
- **Batched operations**: Execute multiple operations in a single transaction
- **Enhanced security**: Add custom logic to EOA transactions

## Project Overview

This demo includes:

- **Smart Contracts**:
  - `Wallet.sol`: A simple wallet contract that can be delegated to EOAs via EIP-7702
  - `Batcher.sol`: A contract for executing multiple calls in a single transaction
  - `TestCoin.sol`: An ERC-20 token for testing transfers
- **TypeScript Scripts**:

  - Deployment scripts for all contracts
  - Fund distribution script for test wallets
  - Main demo script showcasing sponsored batched transactions

- **Key Features**:
  - Gas sponsorship using EIP-7702 authorization lists
  - Batched token transfers from multiple wallets
  - Hardhat 3 Beta integration with `viem` for EIP-7702 support

## How It Works

1. **Authorization**: Child wallets sign EIP-7702 authorization messages to delegate execution to the `Wallet` contract
2. **Batching**: The `Batcher` contract receives multiple calls and executes them sequentially
3. **Sponsorship**: A sponsor account pays gas for the entire batch transaction
4. **Execution**: Token transfers are executed from multiple child wallets in a single sponsored transaction

## Live Demo on Optimism

### Deployed Contracts

The following contracts have been deployed on Optimism mainnet:

- **TestCoin (ERC-20)**: [`0xA8C14b02CCa34f3595161CeA593B291009038426`](https://optimistic.etherscan.io/address/0xA8C14b02CCa34f3595161CeA593B291009038426)
- **Wallet Contract**: [`0x3BF35243aE319B3be9649f707eaB23E1502F2E27`](https://optimistic.etherscan.io/address/0x3BF35243aE319B3be9649f707eaB23E1502F2E27)
- **Batcher Contract**: [`0x837F465302D425E9cF22b986c8DCeB2542f68159`](https://optimistic.etherscan.io/address/0x837F465302D425E9cF22b986c8DCeB2542f68159)

### Example Transaction

You can see a live example of the sponsored batched transaction on Optimism:

**Transaction Hash**: [`0x785397663999b859ba443ce7c235cf06a13655d7fe290bce9c1f2215d56b7c92`](https://optimistic.etherscan.io/tx/0x785397663999b859ba443ce7c235cf06a13655d7fe290bce9c1f2215d56b7c92)

This transaction demonstrates:

- EIP-7702 authorization delegation from multiple EOAs to the Wallet contract
- Sponsored gas payment by a single account
- Batched execution of token transfers from 5 different wallets
- All operations completed in a single transaction

## Setup and Usage

### Prerequisites

- Node.js (v18 or later)
- pnpm package manager
- An Ethereum network that supports EIP-7702 (e.g., local testnet, specific testnets)

### Installation

```shell
pnpm install
```

### Configuration

1. **Set the TEST_MNEMONIC variable:**
   ```shell
   pnpm hardhat keystore set TEST_MNEMONIC
   ```
   This will prompt you to enter your twelve word mnemonic phrase securely. This mnemonic will be used to generate the sponsor account and child wallets.

### Deployment Steps

2. **Deploy the TestCoin contract:**

   ```shell
   pnpm run deployTestToken --network optimism
   ```

3. **Deploy the Wallet contract:**

   ```shell
   pnpm run deployWallet --network optimism
   ```

4. **Deploy the Batcher contract:**
   ```shell
   pnpm run deployBatcher --network optimism
   ```

### Running the Demo

5. **Fund the child wallets with test tokens:**

   ```shell
   pnpm run sendTestCoin --network optimism
   ```

   This script will send 100 TestCoin tokens to each of the 5 child wallets.

6. **Run the main demo:**
   ```shell
   pnpm run demo --network optimism
   ```
   This will execute a sponsored batch transaction that transfers 5 tokens from each child wallet to a receiver, with all gas costs paid by the sponsor account.

## Benefits Demonstrated

- **Cost Efficiency**: Single transaction for multiple operations reduces gas costs
- **User Experience**: Child wallets don't need ETH for gas
- **Scalability**: Batch operations scale better than individual transactions
- **Flexibility**: Sponsor can be any account, enabling various business models

## Available Scripts

- `pnpm run deployTestToken --network optimism` - Deploy the TestCoin ERC-20 token contract
- `pnpm run deployWallet --network optimism` - Deploy the Wallet contract for EIP-7702 delegation
- `pnpm run deployBatcher --network optimism` - Deploy the Batcher contract for batched operations
- `pnpm run sendTestCoin --network optimism` - Distribute TestCoin tokens to child wallets
- `pnpm run demo --network optimism` - Execute the main sponsored batched transaction demo
